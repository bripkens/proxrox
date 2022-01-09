import { v4 as uuidv4 } from 'uuid';

import { start, stop } from './control';

jest.mock('uuid');

(uuidv4 as jest.Mock).mockReturnValue('dsahjk318djksa');

describe('start with nginx', () => {
  const originalProcessCwd = process.cwd;

  beforeEach(() => {
    process.cwd = () => '/tmp';
  });

  afterEach(() => {
    process.cwd = originalProcessCwd;
  });

  it('must actually start nginx', async () => {
    await stop();
    const result = await start({
      port: 49748
    });
    await stop();
    // Remove random segments from the snapshot test
    result.spawnResult = undefined;
    expect(result).toMatchInlineSnapshot(`
Object {
  "enrichedConfig": Object {
    "directoryIndex": true,
    "extraSite": "",
    "gzip": true,
    "http2": false,
    "logDir": "logs",
    "port": 49748,
    "proxy": Object {},
    "proxyReadTimeout": "60s",
    "root": "/tmp",
    "serverName": "example",
    "ssi": false,
    "standardServer": true,
    "stubStatus": false,
    "tls": false,
    "tlsCertificateFile": "",
    "tlsCertificateKeyFile": "",
    "tmpDir": "/tmp/proxrox/dsahjk318djksa",
    "websocketProxy": Object {},
  },
  "receivedConfig": Object {
    "port": 49748,
  },
  "spawnResult": undefined,
}
`);
  });
});
