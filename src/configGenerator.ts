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
    configWithDefaults.extraSite = indentToEnsureFittingPositioning(configWithDefaults.extraSite, 2);
  }

  configWithDefaults.proxy.forEach(p => {
    if (p.additionalDirectives) {
      p.additionalDirectives = indentToEnsureFittingPositioning(p.additionalDirectives, 6)
    }
  });

  return compiledTemplate(configWithDefaults);
}

function indentToEnsureFittingPositioning(str: string, numberOfSpaces: number): string {
  return str
    .trim()
    .split('\n')
    .map(line =>  ' '.repeat(numberOfSpaces) + line)
    .join('\n');
}
