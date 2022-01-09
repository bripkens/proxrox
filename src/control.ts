import { spawnSync, SpawnSyncReturns } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

import { Config, ConfigWithDefaults } from './config';
import { setDefaults } from './configDefaults';
import { generate } from './configGenerator';
import { validate } from './configValidation';
import { createCertificates } from './ssl';

interface SpawnError extends Error {
  spawnResult: SpawnSyncReturns<string>;
}

export interface SpawnResult {
  pid: number;
  stdout: string;
  stderr: string;
  error?: Error;
  status: number | null;
}

export interface StartError extends Error {
  startResult: StartResult;
}

export interface StartResult {
  receivedConfig: Config;
  enrichedConfig?: ConfigWithDefaults;
  spawnResult?: SpawnResult;
}

export async function start(
  configWithoutDefaults: Config
): Promise<StartResult> {
  const config: ConfigWithDefaults = setDefaults(configWithoutDefaults);
  const startResult: StartResult = {
    receivedConfig: configWithoutDefaults,
    enrichedConfig: config
  };

  try {
    validate(config);
  } catch (e) {
    (e as StartError).startResult = startResult;
    throw e;
  }

  try {
    await createFilesAndDirectories(config);
  } catch (e) {
    (e as StartError).startResult = startResult;
    throw e;
  }
  try {
    const spawnResult = startNginx(config);
    startResult.spawnResult = spawnResult;
  } catch (e) {
    startResult.spawnResult = (e as SpawnError).spawnResult;
    (e as StartError).startResult = startResult;
    throw e;
  }

  return startResult;
}

// exported for testing purposes
export async function createFilesAndDirectories(config: ConfigWithDefaults) {
  // Remove all information related to the previous run.
  await cleanTmpDir(config);

  // And completely re-create the structure.
  await fs.mkdir(config.tmpDir, { mode: '755', recursive: true });

  await Promise.all([
    writeNginxConfig(config),
    fs.mkdir(path.join(config.tmpDir, 'clientBody'), { mode: '755' }),
    fs.mkdir(path.join(config.tmpDir, 'proxy'), { mode: '755' }),
    fs.mkdir(path.resolve(config.tmpDir, config.logDir), {
      mode: '755',
      recursive: true,
    }),
    fs.copyFile(
      path.join(__dirname, '..', 'templates', 'mime.types'),
      path.join(config.tmpDir, 'mime.types')
    ),
    copyCertificates(config),
  ]);
}

async function cleanTmpDir(config: ConfigWithDefaults) {
  try {
    await fs.stat(config.tmpDir);
    // We could use the 'force' flag here, but just to avoid a potentially
    // harmful rm -rf code path, we just don't
    await fs.rm(config.tmpDir, { recursive: true });
  } catch (e) {
    // ignore - most likely the directory does not exist
  }
}

async function writeNginxConfig(config: ConfigWithDefaults): Promise<void> {
  const configStr = await generate(config);
  await fs.writeFile(path.join(config.tmpDir, 'nginx.conf'), configStr);
}

async function copyCertificates(config: ConfigWithDefaults): Promise<void> {
  if (!config.tls) {
    return;
  }

  if (config.tlsCertificateFile && config.tlsCertificateKeyFile) {
    await Promise.all([
      fs.copyFile(
        config.tlsCertificateFile,
        path.join(config.tmpDir, 'server.crt')
      ),
      fs.copyFile(
        config.tlsCertificateKeyFile,
        path.join(config.tmpDir, 'server.key')
      ),
    ]);
  } else {
    await createCertificates(config.tmpDir);
  }
}

function startNginx(config: ConfigWithDefaults): SpawnSyncReturns<string> {
  const spawnResult = spawnSync(
    'nginx',
    ['-c', path.join(config.tmpDir, 'nginx.conf'), '-p', config.tmpDir],
    {
      stdio: 'inherit',
      encoding: 'utf8',
    }
  );

  let error;
  if (spawnResult.error) {
    error = new Error(
      'Failed to start the server: ' + spawnResult.error,
      // @ts-expect-error Error causes are not yet supported by TypeScript
      {
        cause: spawnResult.error,
      }
    );
  } else if (spawnResult.status !== 0) {
    error = new Error(
      'Failed to start the server. Server exited with a status code != 0'
    );
  }

  if (error) {
    (error as SpawnError).spawnResult = spawnResult;
    throw error;
  }

  return spawnResult;
}

export async function stop() {
  spawnSync('pkill', ['-f', 'nginx: master process'], {encoding: 'utf8'});
}
