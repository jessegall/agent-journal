/**
 * The record of the comparison runs: for each view when it last ran, the hash of the design it ran against and how many
 * differences it left. compare.ts writes it after every run; pages.ts reads it to tell which pages to look at again.
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

export type ViewRecord = { ranAt: string; designHash: string; differencesLeft: number };

export const DESIGN_FILE = 'docs/designs/home-v6/index.html';
export const RECORD_FILE = 'tools/design-compare/record.json';

export function designHash(): string {
    return createHash('sha256').update(readFileSync(DESIGN_FILE)).digest('hex');
}

export function readRecords(): Record<string, ViewRecord> {
    return JSON.parse(readFileSync(RECORD_FILE, 'utf8')) as Record<string, ViewRecord>;
}
