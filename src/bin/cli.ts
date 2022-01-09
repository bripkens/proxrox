import { Command } from 'commander';
import colors from 'colors/safe';

import { Config, start, stop } from '../index';
import { loadConfig } from '../configLoader';

const program = new Command();

// Prefer to load at runtime directly from the package.json to simplify
// the TypeScript build. Without this, we would have to make the build
// more complicated to adapt the root dir accordingly.
// eslint-disable-next-line
program.version(require('../../package.json').version);

program
  .command('start [config]')
  .description(
    'Start an nginx instance with the given proxrox configuration file'
  )
  .action(async configPath => {
    if (!configPath) {
      console.error(
        'Please provide the path to the proxrox configuration file as an argument.'
      );
      process.exit(1);
    }

    const loadedConfig: Config = await loadConfig(configPath);

    // TODO error handling
    const result = await start(loadedConfig);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const enrichedConfig = result.enrichedConfig!;

    console.log(colors.green(colors.underline('Server successfully started')));
    if (enrichedConfig.standardServer) {
      const scheme = enrichedConfig.tls ? 'https' : 'http';
      const uri = scheme + '://localhost:' + enrichedConfig.port;
      console.log('URI:                             %s', uri);
    }
    console.log('Nginx config and log location:   %s', enrichedConfig.tmpDir);
  });

program
  .command('stop')
  .description('Stop all running nginx instances')
  .action(() => stop());

// Exported to allow testing.
export async function main(argv: string[]) {
  await program.parseAsync(argv);
  // if (executedCommands.length === 0) {
  //   // this automatically quits the program
  //   program.help();
  // }
}
