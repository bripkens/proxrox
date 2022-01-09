export interface ProxyDefinition {
  [urlPathPrefix: string]: string;
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

  proxy: ProxyDefinition;
  websocketProxy: ProxyDefinition;
  proxyReadTimeout: string;

  tls?: boolean;
  tlsCertificateFile?: string;
  tlsCertificateKeyFile?: string;
}

export type Config = Partial<ConfigWithDefaults>;
