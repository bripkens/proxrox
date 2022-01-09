import { load as loadYaml } from 'js-yaml';
import { promises as fs } from 'fs';
import path from 'path';

import { Config } from './config';

export async function loadConfig(configPath: string): Promise<Config> {
  const config = await loadAndParse(configPath);
  turnRelativeIntoAbsolutePaths(configPath, config);
  return config;
}

async function loadAndParse(configPath: string): Promise<Config> {
  try {
    const fileContent = await fs.readFile(configPath, { encoding: 'utf8' });
    return loadYaml(fileContent) as Promise<Config>;
  } catch (e) {
    throw new Error(
      `Cannot read/parse config file '${configPath}'`,
      // @ts-expect-error Error causes are not yet support by the TypeScript types
      // https://github.com/tc39/proposal-error-cause
      { cause: e }
    );
  }
}

function turnRelativeIntoAbsolutePaths(configPath: string, config: Config) {
  // relative root paths should be supported. Resolve the root against the config location.
  if (config.root && typeof config.root === 'string') {
    const root = path.resolve(
      path.dirname(configPath),
      config.root
    );
    config.root = root;
  }
}
