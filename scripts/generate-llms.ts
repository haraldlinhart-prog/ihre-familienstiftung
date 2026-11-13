import { mkdirSync, writeFileSync } from 'node:fs';
import { buildLlmsFullTxt, buildLlmsTxt } from '../lib/llms';

mkdirSync('public', { recursive: true });
writeFileSync('public/llms.txt', buildLlmsTxt());
writeFileSync('public/llms-full.txt', buildLlmsFullTxt());
