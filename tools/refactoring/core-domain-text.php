<?php

declare(strict_types=1);

/**
 * Lists every mention of a domain in core's files, read as text: a Domain\<Name> namespace, a domain/<Name> path or a
 *
 * @domain/<name> frontend import, in code, strings, comments and docblocks alike. Core never depends on a domain, and
 * the class scan of DomainBoundaryTest cannot see a name in a string, a config file or a comment (user message 22343).
 * Only the composition files that install the domains and generated caches may name them.
 *
 *   php tools/refactoring/core-domain-text.php [<root>]
 *       prints "file:line<TAB>..." for each mention, and fails while there is one.
 */

/** The folders written by generators, which name whatever they are given. */
const GENERATED_FOLDERS = '#^(bootstrap/cache|resources/js/(generated|routes|actions|wayfinder))/#';

main($argv[1] ?? dirname(__DIR__, 2));

function main(string $root): void
{
    $domains = installedDomains($root);
    $faults = [];

    foreach (coreFiles($root) as $file) {
        foreach (file($file) ?: [] as $index => $line) {
            $named = mentionedDomain($line, $domains);

            if ($named !== null) {
                $relative = substr($file, strlen($root) + 1);
                $faults[] = "{$relative}:".($index + 1)."\tcore names the {$named} domain: reach it only through "
                    .'what it exports, and name it only in the composition files';
            }
        }
    }

    echo implode('', array_map(fn (string $fault) => $fault."\n", $faults));
    exit($faults === [] ? 0 : 1);
}

/**
 * The names of the domains under domain/.
 *
 * @return list<string>
 */
function installedDomains(string $root): array
{
    return array_values(array_map(basename(...), glob("{$root}/domain/*", GLOB_ONLYDIR) ?: []));
}

/**
 * Every core file read as text: code, config, routes, database, bootstrap and the core frontend, less the files that
 * compose the domains and what is generated.
 *
 * @return list<string>
 */
function coreFiles(string $root): array
{
    $composition = [
        'bootstrap/domains.php',
        'bootstrap/providers.php',
        'bootstrap/app.php',
        'config/auth.php',
        'database/seeders/DatabaseSeeder.php',
    ];
    $files = [];

    foreach (['app', 'config', 'routes', 'database', 'bootstrap', 'resources/js'] as $folder) {
        if (! is_dir("{$root}/{$folder}")) {
            continue;
        }

        $entries = new RecursiveIteratorIterator(new RecursiveDirectoryIterator(
            "{$root}/{$folder}",
            FilesystemIterator::SKIP_DOTS
        ));

        foreach ($entries as $entry) {
            $relative = substr($entry->getPathname(), strlen($root) + 1);

            if (preg_match(GENERATED_FOLDERS, $relative) === 1 || in_array($relative, $composition, true)
                || preg_match('/\.(php|ts|vue|js|json|md)$/', $relative) !== 1) {
                continue;
            }

            $files[] = $entry->getPathname();
        }
    }

    sort($files);

    return $files;
}

/**
 * The domain a line names, or null when it names none.
 *
 * @param  list<string>  $domains
 */
function mentionedDomain(string $line, array $domains): string|null
{
    foreach ($domains as $domain) {
        $lower = strtolower($domain);

        if (preg_match('#Domain\\\\+'.$domain.'\b|domain/'.$domain.'\b|@domain/'.$lower.'\b#', $line) === 1) {
            return $domain;
        }
    }

    return null;
}
