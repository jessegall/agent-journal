/**
 * Lists every name the frontend declares at the top level of its .ts and .vue files, for review as the PHP names are.
 *
 *   node --experimental-strip-types tools/refactoring/list-frontend-names.ts resources/js
 *       prints every name.
 *   node --experimental-strip-types tools/refactoring/list-frontend-names.ts --check <list> resources/js domain
 *       prints the names not on the reviewed list and fails while there is one.
 *   node --experimental-strip-types tools/refactoring/list-frontend-names.ts --accept <list> resources/js domain
 *       writes every current name to the reviewed list, after they were read and the unclear ones renamed.
 */
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { frontendNamesOf, reviewLine, type DeclaredName } from './frontendNames.ts';

type Placed = DeclaredName & { file: string };

const SKIPPED_FOLDERS = new Set(['node_modules', 'vendor', 'generated', 'actions', 'routes', 'wayfinder']);

const [first, ...rest] = process.argv.slice(2);
const mode = first === '--check' || first === '--accept' ? first : '--list';
const folders = mode === '--list' ? [first, ...rest].filter(Boolean) : rest.slice(1);
const reviewedFile = mode === '--list' ? '' : rest[0];
const names = folders.flatMap(namesUnder);

if (mode === '--list') {
    names.forEach((declared) => console.log(`${reviewLine(declared)}\t${declared.file}:${declared.line}`));
} else if (mode === '--accept') {
    const current = [...new Set(names.map(reviewLine))].sort();
    writeFileSync(reviewedFile, `${current.join('\n')}\n`);
    console.log(`${current.length} frontend names recorded as reviewed in ${reviewedFile}`);
} else {
    report(unreviewed(names, reviewedFile));
}

function namesUnder(folder: string): Placed[] {
    return sourceFiles(folder).flatMap((file) =>
        frontendNamesOf(file, readFileSync(file, 'utf8')).map((declared) => ({ ...declared, file })),
    );
}

function sourceFiles(folder: string): string[] {
    return readdirSync(folder).flatMap((entry) => {
        const path = join(folder, entry);

        if (statSync(path).isDirectory()) {
            return SKIPPED_FOLDERS.has(entry) ? [] : sourceFiles(path);
        }

        return /\.(ts|vue)$/.test(entry) && !/\.(test|d)\.ts$/.test(entry) ? [path] : [];
    });
}

function unreviewed(found: Placed[], listFile: string): Placed[] {
    const reviewed = new Set(existsSync(listFile) ? readFileSync(listFile, 'utf8').split('\n') : []);

    return found.filter((declared) => !reviewed.has(reviewLine(declared)));
}

function report(missing: Placed[]): void {
    if (missing.length === 0) {
        console.log(`All ${names.length} frontend names were reviewed.`);

        return;
    }

    console.log(
        `${missing.length} frontend names were not reviewed yet; read each, rename what is not plain programming English, then record them with --accept:`,
    );
    missing.forEach((declared) => console.log(`  ${declared.type} ${declared.name} (${declared.file}:${declared.line})`));
    process.exitCode = 1;
}
