import { v4 as uuidv4 } from 'uuid';

import { setDefaults } from './configDefaults';

jest.mock('uuid');

describe('setDefaults', () => {
  const originalProcessCwd = process.cwd;

  beforeEach(() => {
    process.cwd = () => '/home/user/project';
  });

  afterEach(() => {
    process.cwd = originalProcessCwd;
  });

  it('must set expected defaults', () => {
    (uuidv4 as jest.Mock).mockReturnValue('dsahjk318djksa');
    expect(setDefaults({})).toMatchInlineSnapshot(`
Object {
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
}
`);
  });
});
