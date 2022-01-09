import {promises as fs, default as fsWithSync} from 'fs';
import {compile} from 'ejs';
import path from 'path';

import { ConfigWithDefaults } from './config';

const rawTemplate = fsWithSync.readFileSync(
  path.join(__dirname, '..', 'templates', 'nginx.conf.ejs'),
  { encoding: 'utf8' }
);
const compiledTemplate = compile(rawTemplate);

export async function generate(configWithDefaults: ConfigWithDefaults): Promise<string> {
  configWithDefaults = {
    ...configWithDefaults
  };
  if (configWithDefaults.extraSite) {
    configWithDefaults.extraSite = await fs.readFile(configWithDefaults.extraSite, {encoding: 'utf8'});
    configWithDefaults.extraSite = indentToEnsureFittingPositioning(configWithDefaults.extraSite);
  }

  return compiledTemplate(configWithDefaults);
}

function indentToEnsureFittingPositioning(extraSite: string): string {
  return extraSite
    .trim()
    .split('\n')
    .map(line =>  '  ' + line)
    .join('\n');
}
