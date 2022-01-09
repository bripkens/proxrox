import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import colors from 'colors/safe';
import { diffChars } from 'diff';
import { tmpdir } from 'os';
import path from 'path';

import { setDefaults } from './configDefaults';
import { generate } from './configGenerator';
import { Config } from './config';

describe('generate', () => {
  it('must support simple http serving', async () => {
    await testConfig(
      {
        standardServer: true,
        tmpDir: '/tmp/proxrox',
        serverName: 'example',
        port: 8080,
        root: '/var/www',
        logDir: '/tmp/nginx-logs/',
      },
      'simple.conf'
    );
  });

  it('must disable directory indices', async () => {
    await testConfig(
      {
        standardServer: true,
        tmpDir: '/tmp/proxrox',
        serverName: 'example',
        port: 8080,
        root: '/var/www',
        logDir: '/tmp/nginx-logs/',
        directoryIndex: false,
      },
      'directoryIndex.conf'
    );
  });

  it('must disable gzip', async () => {
    await testConfig(
      {
        standardServer: true,
        tmpDir: '/tmp/proxrox',
        serverName: 'example',
        port: 8080,
        root: '/var/www',
        logDir: '/tmp/nginx-logs/',
        gzip: false,
      },
      'gzip.conf'
    );
  });

  it('must proxy requests', async () => {
    await testConfig(
      {
        standardServer: true,
        tmpDir: '/tmp/proxrox',
        serverName: 'example',
        port: 8080,
        root: '/var/www',
        logDir: '/tmp/nginx-logs/',
        proxy: {
          '/': 'http://127.0.0.1:8080',
        },
      },
      'proxy.conf'
    );
  });

  it('must support ssi', async () => {
    await testConfig(
      {
        standardServer: true,
        tmpDir: '/tmp/proxrox',
        serverName: 'example',
        port: 8080,
        root: '/var/www',
        logDir: '/tmp/nginx-logs/',
        ssi: true,
      },
      'ssi.conf'
    );
  });

  it('must support tls', async () => {
    await testConfig(
      {
        standardServer: true,
        tmpDir: '/tmp/proxrox',
        serverName: 'example',
        port: 8080,
        root: '/var/www',
        logDir: '/tmp/nginx-logs/',
        tls: true,
      },
      'tls.conf'
    );
  });

  it('must support multiple proxies', async () => {
    await testConfig(
      {
        standardServer: true,
        tmpDir: '/tmp/proxrox',
        serverName: 'example',
        port: 8080,
        root: '/var/www',
        logDir: '/tmp/nginx-logs/',
        proxy: {
          '/': 'http://127.0.0.1:8080',
          '/api': 'http://api.example.com',
        },
      },
      'proxies.conf'
    );
  });

  it('must work without root proxy', async () => {
    await testConfig(
      {
        standardServer: true,
        tmpDir: '/tmp/proxrox',
        serverName: 'example',
        port: 8080,
        root: '/var/www',
        logDir: '/tmp/nginx-logs/',
        proxy: {
          '/cms': 'http://127.0.0.1:8080',
          '/api': 'http://api.example.com',
        },
      },
      'proxies_without_try_files.conf'
    );
  });

  it('must proxy on root without static asset serving', async () => {
    await testConfig(
      {
        standardServer: true,
        tmpDir: '/tmp/proxrox',
        serverName: 'example',
        port: 8080,
        root: false,
        logDir: '/tmp/nginx-logs/',
        proxy: {
          '/': 'http://127.0.0.1:3000',
          '/cms': 'http://127.0.0.1:8080',
          '/api': 'http://api.example.com',
        },
      },
      'proxies_without_static_asset_serving.conf'
    );
  });

  it('must proxy with websocket upgrade support', async () => {
    await testConfig(
      {
        standardServer: true,
        tmpDir: '/tmp/proxrox',
        serverName: 'example',
        port: 8080,
        root: false,
        logDir: '/tmp/nginx-logs/',
        websocketProxy: {
          '/api/data': 'http://api.example.com/api/foo',
        },
      },
      'websocket_proxy.conf'
    );
  });

  it('must proxy with ssi', async () => {
    await testConfig(
      {
        standardServer: true,
        tmpDir: '/tmp/proxrox',
        serverName: 'example',
        port: 8080,
        root: false,
        logDir: '/tmp/nginx-logs/',
        ssi: true,
        proxy: {
          '/': 'http://127.0.0.1:3000',
          '/cms': 'http://127.0.0.1:8080',
          '/api': 'http://api.example.com',
        },
      },
      'proxies_with_ssi.conf'
    );
  });

  it('must support HTTP2', async () => {
    await testConfig(
      {
        standardServer: true,
        tmpDir: '/tmp/proxrox',
        serverName: 'example',
        port: 8080,
        root: '/var/www',
        logDir: '/tmp/nginx-logs/',
        http2: true,
      },
      'http2.conf'
    );
  });

  it('must support HTTP2 with tls', async () => {
    await testConfig(
      {
        standardServer: true,
        tmpDir: '/tmp/proxrox',
        serverName: 'example',
        port: 8080,
        root: '/var/www',
        logDir: '/tmp/nginx-logs/',
        http2: true,
        tls: true,
      },
      'http2_with_tls.conf'
    );
  });

  it('must support stub status', async () => {
    await testConfig(
      {
        standardServer: true,
        tmpDir: '/tmp/proxrox',
        serverName: 'example',
        port: 8080,
        root: '/var/www',
        logDir: '/tmp/nginx-logs/',
        stubStatus: true,
      },
      'stubStatus.conf'
    );
  });

  describe('extraSite', () => {
    const pathToExtraSite = path.join(tmpdir(), uuidv4());

    beforeAll(async () => {
      await fs.writeFile(pathToExtraSite, 'server {\n  listen 123;\n}');
    });

    afterAll(async () => {
      await fs.unlink(pathToExtraSite);
    });

    it('must add an extra site', async () => {
      await testConfig(
        {
          standardServer: true,
          tmpDir: '/tmp/proxrox',
          serverName: 'example',
          port: 8080,
          root: '/var/www',
          logDir: '/tmp/nginx-logs/',
          stubStatus: true,
          extraSite: pathToExtraSite,
        },
        'extraSite.conf'
      );
    });

    it('must only have the extra site', async () => {
      await testConfig(
        {
          standardServer: false,
          tmpDir: '/tmp/proxrox',
          serverName: 'example',
          port: 8080,
          root: '/var/www',
          logDir: '/tmp/nginx-logs/',
          stubStatus: true,
          extraSite: pathToExtraSite,
        },
        'extraSiteOnly.conf'
      );
    });
  });

  it('must support read timeout', async () => {
    await testConfig(
      {
        standardServer: true,
        tmpDir: '/tmp/proxrox',
        serverName: 'example',
        port: 8080,
        root: '/var/www',
        logDir: '/tmp/nginx-logs/',
        proxyReadTimeout: '120s',
      },
      'timeout.conf'
    );
  });
});

async function testConfig(config: Config, expectedPath: string) {
  const expected = await fs.readFile(
    path.join(__dirname, '__tests__', 'expectedConfigs', expectedPath),
    { encoding: 'utf8' }
  );
  const actual = await generate(setDefaults(config));
  expectNoDiff(actual, expectedPath, expected);
}

function expectNoDiff(
  actual: string,
  expectedPath: string,
  expected: string
): void {
  if (actual === expected) {
    return;
  }

  let msg = colors.red(
    `Differences between expected and actual result in '${expectedPath}':\n`
  );
  const diff = diffChars(expected, actual);

  diff.forEach(part => {
    // green for additions, red for deletions, grey for common parts
    const changeColorizer = part.added
      ? colors.green
      : part.removed
      ? colors.red
      : colors.grey;
    msg += changeColorizer(part.value);
  });

  msg += 'Actual:\n' + actual;
  msg += '\n';

  throw new Error(msg);
}
