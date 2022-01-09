import { v4 as uuidv4 } from 'uuid';
import path from 'path';

import { Config, ConfigWithDefaults } from './config';

export function setDefaults(config: Config): ConfigWithDefaults {
  return {
    serverName: config.serverName || 'example',
    port: config.port || 4000,
    root: config.root ?? process.cwd(),
    logDir: config.logDir || 'logs',
    tmpDir: config.tmpDir || path.join('/tmp', 'proxrox', uuidv4()),

    http2: config.http2 ?? false,
    stubStatus: config.stubStatus ?? false,
    ssi: config.ssi ?? false,
    gzip: config.gzip ?? true,
    directoryIndex: config.directoryIndex ?? true,
    standardServer: config.standardServer ?? true,
    extraSite: config.extraSite || '',

    proxy: config.proxy || [],
    proxyReadTimeout: config.proxyReadTimeout || '60s',

    tls: config.tls ?? false,
    tlsCertificateFile: config.tlsCertificateFile || '',
    tlsCertificateKeyFile: config.tlsCertificateKeyFile || '',
  };
}
