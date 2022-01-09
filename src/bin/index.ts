#!/usr/bin/env node

import { main } from './cli';

main(process.argv)
  .catch(error => console.error('Failed to start nginx', error));
