/**
 * The pages of the app and their comparison views, from pages.json. A run seeds the local journal with the sample
 * records first; a page is named again when a view never ran, ran against an older design or left differences. The list
 * only informs and never fails a build.
 *
 *   node --experimental-strip-types tools/design-compare/pages.ts run [page]   runs every view, or one page's views
 *   node --experimental-strip-types tools/design-compare/pages.ts again        names the pages to look at again
 */
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { designHash, readRecords } from './record.ts';

type PageEntry = { views: string[] } | { noDesign: string };

const pages = JSON.parse(readFileSync('tools/design-compare/pages.json', 'utf8')) as Record<string, PageEntry>;
const [command, chosenPage] = process.argv.slice(2);

if (command === 'run') {
    runViews(chosenPage);
} else if (command === 'again') {
    namePagesToLookAt();
} else {
    console.error('Say run [page] or again.');
    process.exit(2);
}

function viewsOf(entry: PageEntry): string[] {
    return 'views' in entry ? entry.views : [];
}

// A view that cannot be compared is named and left without a new record, and the others still run.
function runViews(page: string | undefined): void {
    seedSampleRecords();
    const chosen = page === undefined ? Object.values(pages) : [pages[page] ?? missingPage(page)];
    const failed = chosen.flatMap(viewsOf).filter((view) => !compared(view));

    if (failed.length > 0) {
        console.error(`Not compared: ${failed.join(', ')}`);
        process.exitCode = 1;
    }
}

function seedSampleRecords(): void {
    const seeding = spawnSync('sh', ['tools/container-run.sh', 'app', '--', 'php', 'artisan', 'db:seed', '--force'], {
        stdio: 'inherit',
    });

    if (seeding.status !== 0) {
        console.error('The local journal could not be seeded, so the row and reader views may find nothing.');
    }
}

function compared(view: string): boolean {
    const run = spawnSync(
        process.execPath,
        ['--experimental-strip-types', 'tools/design-compare/compare.ts', `tools/design-compare/views/${view}.json`],
        { stdio: 'inherit' },
    );

    return run.status === 0;
}

function missingPage(page: string): never {
    console.error(`No page ${page} in pages.json.`);
    process.exit(2);
}

function namePagesToLookAt(): void {
    const records = readRecords();
    const current = designHash();
    let named = 0;

    for (const [page, entry] of Object.entries(pages)) {
        const reasons = viewsOf(entry).flatMap((view) => {
            const last = records[view];

            if (last === undefined) {
                return [`${view} never compared`];
            }

            if (last.designHash !== current) {
                return [`${view} compared against an older design`];
            }

            return last.differencesLeft > 0 ? [`${view} has ${last.differencesLeft} differences left`] : [];
        });

        if (reasons.length > 0) {
            named++;
            console.log(`${page}: ${reasons.join('; ')}`);
        }
    }

    console.log(named === 0 ? 'Every page matches the design it was last compared with.' : `${named} pages to look at again.`);
}
