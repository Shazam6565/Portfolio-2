#!/usr/bin/env node
/**
 * Regenerates the OpenUI Lang system-prompt fragment from
 * src/components/Chat/genui/library.js and prints it to stdout.
 *
 * The prompt is checked into netlify/functions/chat.mjs as the
 * GENUI_PROMPT constant rather than generated at request time (see
 * thesysdev/openui's own reference app, which does the same via a
 * build-time generated file). Run this whenever the component library
 * changes, and paste the output into chat.mjs.
 *
 *   node scripts/generate-genui-prompt.mjs
 */
import pkg from '../src/components/Chat/genui/library.js';

const { library, promptOptions } = pkg;

// eslint-disable-next-line no-console -- this script's whole job is to print to stdout
console.log(library.prompt(promptOptions));
