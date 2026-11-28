<?php

declare(strict_types=1);

/**
 * Rewrites what the syntax tree cannot see after a move: each moved class's file path and class name written as text
 * in the project's PHP, tests, config, docs, tools and frontend, in plain and in escaped (\\) form, whole names only:
 * one pattern finds every class name and app file path, and only those the move list holds change.
 *
 *   php tools/refactoring/layout/moved-strings.php <rows file of move.php> --root=<tree>
 */
$rowsFile = $argv[1] ?? exit("Name the rows file of move.php.\n");
$root = dirname(__DIR__, 3);

foreach (array_slice($argv, 2) as $argument) {
    if (str_starts_with($argument, '--root=')) {
        $root = substr($argument, 7);
    }
}

$replacements = replacementsOf((string) file_get_contents($rowsFile));
$changed = 0;

foreach (textFiles($root) as $file) {
    $text = (string) file_get_contents($file);
    $rewritten = preg_replace_callback(
        $replacements['pattern'],
        fn (array $match) => $replacements['to'][$match[0]] ?? $match[0],
        $text,
    );

    if ($rewritten !== null && $rewritten !== $text) {
        file_put_contents($file, $rewritten);
        $changed++;
    }
}

echo "Rewrote moved paths and names as text in {$changed} files.\n";

/**
 * Every old path and name, plain and escaped, with what it becomes, and one pattern that matches any of them whole.
 *
 * @return array{pattern: string, to: array<string, string>}
 */
function replacementsOf(string $rows): array
{
    $to = [];

    foreach (array_filter(explode("\n", $rows)) as $row) {
        [$oldClass, $newClass, $oldPath, $newPath] = explode(' ', $row);
        $to[$oldPath] = $newPath;
        $to[$oldClass] = $newClass;
        $to[str_replace('\\', '\\\\', $oldClass)] = str_replace('\\', '\\\\', $newClass);
    }

    // Any class name, plain or escaped, and any app file path; only those in the map change.
    // A namespace line names a folder, never the moved class, so it is left as it is.
    $pattern = '~(?<!namespace )(?<![\\w\\\\/])(?:App(?:\\\\{1,2}\\w+)+|app/[\\w/]+\\.php)(?![\\w])~';

    return [
        'pattern' => $pattern,
        'to' => $to,
    ];
}

/**
 * @return iterable<string>
 */
function textFiles(string $root): iterable
{
    $folders = [
        'app',
        'tests',
        'domain',
        'config',
        'routes',
        'bootstrap',
        'database',
        'docs',
        'tools',
        'resources',
        'scripts',
    ];
    $extensions = [
        'php',
        'json',
        'md',
        'txt',
        'ts',
        'vue',
        'neon',
        'xml',
        'yaml',
        'yml',
        'sh',
    ];

    foreach ($folders as $folder) {
        if (! is_dir("{$root}/{$folder}")) {
            continue;
        }

        $files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator("{$root}/{$folder}", FilesystemIterator::SKIP_DOTS));

        foreach ($files as $file) {
            $path = $file->getPathname();

            if (in_array($file->getExtension(), $extensions, true) && ! str_contains($path, '/node_modules/') && ! str_contains($path, '/vendor/')) {
                yield $path;
            }
        }
    }

    foreach ([
        'composer.json',
        'phpstan.neon',
        'phpunit.xml',
        'CLAUDE.md',
        'AGENTS.md',
    ] as $file) {
        if (is_file("{$root}/{$file}")) {
            yield "{$root}/{$file}";
        }
    }
}
