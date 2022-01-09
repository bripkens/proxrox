import { spawnSync } from 'child_process';
import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { tmpdir } from 'os';
import path from 'path';

import { createFilesAndDirectories, start, StartError } from './control';
import { setDefaults } from './configDefaults';

jest.mock('uuid');

(uuidv4 as jest.Mock).mockReturnValue('dsahjk318djksa');

jest.mock('child_process', () => {
  return {
    ...jest.requireActual('child_process'),
    spawnSync: jest.fn()
  }
});

describe('createFilesAndDirectories', () => {
  const tmpDir = path.join(tmpdir(), 'proxrox-control-test', uuidv4());

  it('must create the desired structure', async () => {
    await createFilesAndDirectories(setDefaults({ tmpDir }));
    await assertStandardStructureExists(tmpDir);
  });

  it('must create TLS certificates in the tmpDir', async () => {
    await createFilesAndDirectories(setDefaults({ tmpDir, tls: true }));
    await assertStandardStructureExists(tmpDir);
    await assertTlsFilesExists(tmpDir);
  });

  it('must copy TLS certificates from input config', async () => {
    const tlsCertificateFile = path.join(tmpdir(), `${uuidv4()}-server.crt`);
    const tlsCertificateFileContent = '🤘';
    await fs.writeFile(tlsCertificateFile, tlsCertificateFileContent);
    const tlsCertificateKeyFile = path.join(tmpdir(), `${uuidv4()}-server.key`);
    const tlsCertificateKeyFileContent = '🥸';
    await fs.writeFile(tlsCertificateKeyFile, tlsCertificateKeyFileContent);

    await createFilesAndDirectories(
      setDefaults({
        tmpDir,
        tls: true,
        tlsCertificateFile,
        tlsCertificateKeyFile,
      })
    );

    await assertStandardStructureExists(tmpDir);
    await assertTlsFilesExists(tmpDir);
    const actualTlsCertificateFileContent = await fs.readFile(
      path.join(tmpDir, 'server.crt'),
      { encoding: 'utf8' }
    );
    expect(actualTlsCertificateFileContent).toEqual(tlsCertificateFileContent);
    const actualTlsCertificateKeyFileContent = await fs.readFile(
      path.join(tmpDir, 'server.key'),
      { encoding: 'utf8' }
    );
    expect(actualTlsCertificateKeyFileContent).toEqual(
      tlsCertificateKeyFileContent
    );
  });

  async function assertStandardStructureExists(tmpDir: string) {
    await Promise.all([
      assertFileExists(path.join(tmpDir, 'nginx.conf')),
      assertFileExists(path.join(tmpDir, 'mime.types')),
      assertDirectoryExists(path.join(tmpDir, 'clientBody')),
      assertDirectoryExists(path.join(tmpDir, 'logs')),
      assertDirectoryExists(path.join(tmpDir, 'proxy')),
    ]);
  }

  async function assertTlsFilesExists(tmpDir: string) {
    await Promise.all([
      assertFileExists(path.join(tmpDir, 'server.crt')),
      assertFileExists(path.join(tmpDir, 'server.key')),
    ]);
  }

  async function assertFileExists(p: string) {
    const stats = await fs.stat(p);
    expect(stats.isFile()).toBe(true);
  }

  async function assertDirectoryExists(p: string) {
    const stats = await fs.stat(p);
    expect(stats.isDirectory()).toBe(true);
  }
});

describe('start', () => {
  const originalProcessCwd = process.cwd;

  beforeEach(() => {
    process.cwd = () => '/home/user/project';
  });

  afterEach(() => {
    process.cwd = originalProcessCwd;
  });

  it('must provide debugging information when nginx fails to start', async () => {
    (spawnSync as jest.Mock).mockReturnValue({
      pid: 42,
      error: new Error('simulated error')
    });

    try {
      await start({});
      throw new Error('Start should have failed.')
    } catch (e) {
      expect((e as StartError).startResult).toMatchInlineSnapshot(`
Object {
  "enrichedConfig": Object {
    "directoryIndex": true,
    "extraSite": "",
    "gzip": true,
    "http2": false,
    "logDir": "logs",
    "port": 4000,
    "proxy": Array [],
    "proxyReadTimeout": "60s",
    "root": "/home/user/project",
    "serverName": "example",
    "ssi": false,
    "standardServer": true,
    "stubStatus": false,
    "tls": false,
    "tlsCertificateFile": "",
    "tlsCertificateKeyFile": "",
    "tmpDir": "/tmp/proxrox/dsahjk318djksa",
  },
  "receivedConfig": Object {},
  "spawnResult": Object {
    "error": [Error: simulated error],
    "pid": 42,
  },
}
`);
    }
  });

  it('must provide debugging information when nginx exits with a non-zero exit code', async () => {
    (spawnSync as jest.Mock).mockReturnValue({
      pid: 42,
      status: 1,
      stderr: 'nginx config is borked yo!'
    });

    try {
      await start({});
      throw new Error('Start should have failed.')
    } catch (e) {
      expect((e as StartError).startResult).toMatchInlineSnapshot(`
Object {
  "enrichedConfig": Object {
    "directoryIndex": true,
    "extraSite": "",
    "gzip": true,
    "http2": false,
    "logDir": "logs",
    "port": 4000,
    "proxy": Array [],
    "proxyReadTimeout": "60s",
    "root": "/home/user/project",
    "serverName": "example",
    "ssi": false,
    "standardServer": true,
    "stubStatus": false,
    "tls": false,
    "tlsCertificateFile": "",
    "tlsCertificateKeyFile": "",
    "tmpDir": "/tmp/proxrox/dsahjk318djksa",
  },
  "receivedConfig": Object {},
  "spawnResult": Object {
    "pid": 42,
    "status": 1,
    "stderr": "nginx config is borked yo!",
  },
}
`);
    }
  });
});
