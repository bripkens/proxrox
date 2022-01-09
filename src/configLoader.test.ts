import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import { dump } from 'js-yaml';
import { tmpdir } from 'os';
import path from 'path';

import { loadConfig } from './configLoader';
import { Config } from './config';

describe('loadConfig', () => {
  it('must load config file from disk', async () => {
    const filePath = path.join(tmpdir(), uuidv4());
    const config: Config = {};
    await fs.writeFile(filePath, dump(config));

    const loadedConfig = await loadConfig(filePath);

    expect(loadedConfig).toEqual(config);
  });

  it('must throw an error when the fail is missing', async () => {
    await expect(loadConfig(path.join(tmpdir(), uuidv4()))).rejects.toThrow(
      /Cannot read\/parse config file/
    );
  });

  it('must throw an error when the config cannot be parsed', async () => {
    const filePath = path.join(tmpdir(), uuidv4());
    await fs.writeFile(filePath, '%%%%%%%');

    await expect(loadConfig(path.join(tmpdir(), uuidv4()))).rejects.toThrow(
      /Cannot read\/parse config file/
    );
  });
});
