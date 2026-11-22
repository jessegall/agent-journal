<?php

declare(strict_types=1);

/*
 * Moves, renames or merges classes with every reference to them, from the abstract syntax tree: each request is turned
 * into move rows for tools/refactoring/layout/batch-move.php, which parses the project once and rewrites each file once.
 *
 *   php tools/refactoring/move.php App\\Contracts\\Stacks AgentStacks          rename in place
 *   php tools/refactoring/move.php App\\Contracts\\Stacks App\\Contracts\\Agents\\Stacks
 *   php tools/refactoring/move.php --namespace=App\\Contracts\\Old App\\Contracts\\New
 *   php tools/refactoring/move.php --list=moves.txt                           lines `Old New`, or `Old New # why`
 *   php tools/refactoring/move.php --replace App\\Values\\Old App\\Values\\Kept   merge: repoint every reference, delete Old
 *   php tools/refactoring/move.php --dry-run ...                              print the rows, write nothing
 *   php tools/refactoring/move.php --root=<tree> ...
 *
 * A new name given alone renames the class in its own namespace. Each class's file is found, and its new file placed,
 * through composer.json's PSR-4 map, the longest prefix first.
 */

$root = dirname(__DIR__, 2);
$dryRun = false;
$replace = false;
$listPath = null;
$namespaceFrom = null;
$names = [];

foreach (array_slice($argv, 1) as $argument) {
    match (true) {
        str_starts_with($argument, '--root=') => $root = substr($argument, 7),
        $argument === '--dry-run' => $dryRun = true,
        $argument === '--replace' => $replace = true,
        str_starts_with($argument, '--list=') => $listPath = substr($argument, 7),
        str_starts_with($argument, '--namespace=') => $namespaceFrom = ltrim(substr($argument, 12), '\\'),
        default => $names[] = ltrim($argument, '\\'),
    };
}

$root = realpath($root) ?: exit(failed('The tree root does not exist.'));
$prefixes = psr4Prefixes($root);
$requests = match (true) {
    $listPath !== null => listedRequests($listPath),
    $namespaceFrom !== null && count($names) === 1 => namespaceRequests($root, $prefixes, $namespaceFrom, $names[0]),
    count($names) === 2 => [[$names[0], $names[1]]],
    default => exit(failed('Name the class and its new name, a --namespace with its new namespace, or a --list.')),
};
$rows = [];

foreach ($requests as [$old, $new]) {
    $new = str_contains($new, '\\') ? $new : namespaceOf($old).'\\'.$new;
    $from = fileOf($prefixes, $old);
    $to = fileOf($prefixes, $new);

    if (! is_file("{$root}/{$from}")) {
        exit(failed("{$old} has no file at {$from}."));
    }

    if ($replace !== is_file("{$root}/{$to}")) {
        exit(failed($replace ? "{$new} does not exist to merge {$old} into." : "{$new} exists already at {$to}; merge with --replace."));
    }

    $rows[] = implode(' ', [$old, $new, $from, $to, ...($replace ? ['merge'] : [])]);
}

if ($dryRun) {
    echo implode("\n", $rows)."\n";

    exit(0);
}

$list = tempnam(sys_get_temp_dir(), 'moves');
file_put_contents($list, implode("\n", $rows)."\n");
passthru(implode(' ', array_map('escapeshellarg', [PHP_BINARY, __DIR__.'/layout/batch-move.php', $list, "--root={$root}"])), $status);
unlink($list);

exit($status);

/**
 * @return array<string, string>
 */
function psr4Prefixes(string $root): array
{
    $composer = json_decode((string) file_get_contents("{$root}/composer.json"), true, flags: JSON_THROW_ON_ERROR);
    $prefixes = [...($composer['autoload']['psr-4'] ?? []), ...($composer['autoload-dev']['psr-4'] ?? [])];
    uksort($prefixes, fn (string $left, string $right) => strlen($right) <=> strlen($left));

    return $prefixes;
}

/**
 * @param  array<string, string>  $prefixes
 */
function fileOf(array $prefixes, string $class): string
{
    foreach ($prefixes as $prefix => $folder) {
        if (str_starts_with($class, $prefix)) {
            return rtrim($folder, '/').'/'.str_replace('\\', '/', substr($class, strlen($prefix))).'.php';
        }
    }

    exit(failed("{$class} is under no PSR-4 prefix of composer.json."));
}

/**
 * @return list<array{string, string}>
 */
function listedRequests(string $path): array
{
    $requests = [];

    foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $line) {
        $line = trim(explode('#', $line, 2)[0]);

        if ($line === '') {
            continue;
        }

        [$old, $new] = array_pad(preg_split('/\s+/', $line) ?: [], 2, '');
        $requests[] = [ltrim($old, '\\'), ltrim($new, '\\')];
    }

    return $requests;
}

/**
 * Every class declared in a file under the old namespace's folder, each to the same place under the new namespace.
 *
 * @param  array<string, string>  $prefixes
 * @return list<array{string, string}>
 */
function namespaceRequests(string $root, array $prefixes, string $from, string $to): array
{
    $folder = substr(fileOf($prefixes, $from.'\\X'), 0, -strlen('/X.php'));
    $requests = [];

    foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator("{$root}/{$folder}", FilesystemIterator::SKIP_DOTS)) as $file) {
        if ($file->getExtension() !== 'php') {
            continue;
        }

        $relative = str_replace('/', '\\', substr($file->getPathname(), strlen("{$root}/{$folder}/"), -4));
        $requests[] = ["{$from}\\{$relative}", "{$to}\\{$relative}"];
    }

    sort($requests);

    return $requests;
}

function namespaceOf(string $class): string
{
    return substr($class, 0, (int) strrpos($class, '\\'));
}

function failed(string $reason): int
{
    fwrite(STDERR, $reason."\n");

    return 1;
}
