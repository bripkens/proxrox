export type ProxyType = 'http' | 'websocket' | 'eventsource';

export interface ProxyDefinition {
  type: ProxyType;
  from: string;
  to: string;
  additionalDirectives?: string;
}

export interface ConfigWithDefaults {
  serverName: string;
  port: number;
  root: string | boolean;
  logDir: string;
  tmpDir: string;

  http2: boolean;
  stubStatus: boolean;
  ssi: boolean;
  gzip: boolean;
  directoryIndex: boolean;
  standardServer: boolean;
  extraSite: string;

  proxy: ProxyDefinition[];
  proxyReadTimeout: string;

  tls?: boolean;
  tlsCertificateFile?: string;
  tlsCertificateKeyFile?: string;
}

export type Config = Partial<ConfigWithDefaults>;
