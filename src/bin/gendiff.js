#!/usr/bin/env node
import program from 'commander';
import { version } from '../../package.json';
import gendiff from '..';

program
  .version(version)
  .description('Compares two configuration files and shows a difference.')
  .arguments('<firstConfig> <secondConfig>')
  .option('-f, --format [type]', 'Output format', 'pretty')
  .action((firstConfig, secondConfig) => console.log(gendiff(firstConfig, secondConfig)));
program.parse(process.argv);
