import { ConfigWithDefaults } from "./config";

export function validate(config: ConfigWithDefaults) {
  if ((config.tlsCertificateFile && !config.tlsCertificateKeyFile) ||
       (!config.tlsCertificateFile && config.tlsCertificateKeyFile)) {
    throw new Error(
      'tlsCertificateFile and tlsCertificateKeyFile must both be set!'
    );
  }
}
