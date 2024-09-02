import { createConfig } from 'fuels';

export default createConfig({
  workspace: './sway',
  output: './src/typegen',
  forcBuildFlags: ['--release'],
});

/**
 * Check the docs:
 * https://docs.fuel.network/docs/fuels-ts/fuels-cli/config-file/
 */
