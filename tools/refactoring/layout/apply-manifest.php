<?php

declare(strict_types=1);

/*
 * Checks a move manifest against Git and the working tree, previews it, rehearses it in a throwaway checkout, or
 * applies a batch of its rows (doc 107 revision 3, Batch admission, recovery and phase evidence).
 *
 *   php tools/refactoring/layout/apply-manifest.php <manifest.json> --dry-run
 *   php tools/refactoring/layout/apply-manifest.php <manifest.json> --rows=<old path prefix> [--rows=…]
 *   php tools/refactoring/layout/apply-manifest.php <manifest.json> --rows=… --rehearse
 *   php tools/refactoring/layout/apply-manifest.php <manifest.json> --root=<tree> --state=<state.json> …
 *
 * Class rows move through move.php, one row at a time; every other row moves with git mv, and the files a row lists
 * in literal_references have its old path rewritten to the new one. Every skipped, missed or occupied row is a
 * failure, as is a removed class still named anywhere. The state file keeps the rows moved and the files each move
 * edited (file, prior blob, resulting blob, move), so a resumed batch retries only the rest and an edit nobody
 * recorded fails admission. The exit code is 0 for a pass and 1 with the failures listed.
 */

$options = optionsOf(array_slice($argv, 1));
$root = realpath($options['root'] ?? dirname(__DIR__, 3)) ?: exit(failWith(['The tree root does not exist.']));
$manifestPath = $options['manifest'] ?? exit(failWith(['Name a manifest file.']));
$rows = json_decode((string) file_get_contents($manifestPath), true, flags: JSON_THROW_ON_ERROR);
$statePath = $options['state'] ?? $manifestPath.'.state.json';
$state = is_file($statePath)
    ? json_decode((string) file_get_contents($statePath), true, flags: JSON_THROW_ON_ERROR)
    : ['moved' => [], 'edits' => []];

if (isset($options['rehearse'])) {
    exit(rehearse($root, $argv));
}

$batch = selectRows($rows, $options['rows']);
$failures = admissionFailures($root, $rows, $batch, $state);

if ($failures !== []) {
    exit(failWith($failures));
}

if (isset($options['dry-run'])) {
    foreach ($batch as $row) {
        $done = isset($state['moved'][$row['old_path']]) ? ' (moved already)' : '';
        echo "{$row['status']} {$row['old_path']} -> {$row['final_path']}{$done}\n";
    }

    echo 'pass: '.count($rows).' rows checked, '.count($batch)." in the batch\n";
    exit(0);
}

foreach ($batch as $row) {
    if ($row['status'] !== 'move' || isset($state['moved'][$row['old_path']])) {
        continue;
    }

    $before = trackedBlobs($root);
    $failure = $row['kind'] === 'class' ? moveClass($root, $row) : moveFile($root, $row);
    $after = trackedBlobs($root);

    foreach (array_keys($after + $before) as $file) {
        if (($before[$file] ?? null) !== ($after[$file] ?? null) && $file !== $row['old_path'] && $file !== $row['final_path']) {
            $state['edits'][$file] = [
                'prior' => $before[$file] ?? null,
                'result' => $after[$file] ?? null,
                'move' => $row['old_path'],
            ];
        }
    }

    if ($failure === null) {
        $state['moved'][$row['old_path']] = blobOf($root, $row['final_path']);
    }

    file_put_contents($statePath, json_encode($state, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)."\n");

    if ($failure !== null) {
        exit(failWith([$failure, 'The rows before it are kept in '.$statePath.'; run again to retry the rest.']));
    }
}

echo 'pass: '.count($batch)." rows applied\n";
exit(0);

/**
 * Every reason the batch may not start: a stale or changed source, an occupied or clashing destination, a reserved
 * name used twice, or an edit to a file the state does not account for.
 *
 * @param  list<array<string, mixed>>  $rows
 * @param  list<array<string, mixed>>  $batch
 * @param  array{moved: array<string, string>, edits: array<string, array<string, string|null>>}  $state
 * @return list<string>
 */
function admissionFailures(string $root, array $rows, array $batch, array $state): array
{
    if ($rows === []) {
        return ['The manifest has no rows.'];
    }

    $failures = [];
    $moving = [];
    $current = blobsOf($root, array_column($batch, 'old_path'));

    foreach ($rows as $row) {
        if ($row['status'] === 'move' && ! isset($state['moved'][$row['old_path']])) {
            $moving[$row['old_path']] = true;
        }
    }

    foreach ($state['edits'] as $file => $edit) {
        if (blobOf($root, $file) !== $edit['result']) {
            $failures[] = "{$file} changed after the move of {$edit['move']} edited it, and no move recorded that change.";
        }
    }

    foreach ($state['moved'] as $old => $blob) {
        $row = rowOf($rows, $old);

        if ($row !== null && blobOf($root, $row['final_path']) !== $blob) {
            $failures[] = "{$row['final_path']} is not the file the move of {$old} left there.";
        }
    }

    foreach ($batch as $row) {
        if (isset($state['moved'][$row['old_path']])) {
            continue;
        }

        $blob = $current[$row['old_path']] ?? null;

        if ($blob === null) {
            $failures[] = "{$row['old_path']} is missing, so its row cannot move it.";
        } elseif ($blob !== $row['blob']) {
            $failures[] = "{$row['old_path']} changed since the manifest was made (stale row): make the manifest again.";
        }

        $destination = $row['final_path'];

        if ($row['status'] === 'move' && file_exists("{$root}/{$destination}") && ! isset($moving[$destination])) {
            $failures[] = "{$destination} is occupied, so {$row['old_path']} cannot move there.";
        }
    }

    $paths = [];
    $classes = [];
    $migrations = [];

    foreach ($rows as $row) {
        $paths[strtolower($row['final_path'])][] = $row['old_path'];

        if ($row['final_class'] !== null) {
            $classes[strtolower($row['final_class'])][] = $row['old_path'];
        }

        if ($row['kind'] === 'anonymous migration') {
            $migrations[basename($row['final_path'])][] = $row['old_path'];
        }
    }

    $arrived = array_flip(array_map(fn (string $old) => rowOf($rows, $old)['final_path'] ?? '', array_keys($state['moved'])));

    foreach (existingFiles($root) as $file) {
        if (! rowOf($rows, $file) && ! isset($arrived[$file]) && isset($paths[strtolower($file)])) {
            $paths[strtolower($file)][] = $file;
        }
    }

    foreach ([$paths, $classes] as $names) {
        foreach ($names as $name => $sources) {
            if (count($sources) > 1) {
                $failures[] = "{$name} would be the destination of ".implode(' and ', $sources).' (case-folded clash).';
            }
        }
    }

    foreach ($migrations as $basename => $sources) {
        if (count($sources) > 1) {
            $failures[] = "The migration basename {$basename} is reserved twice: ".implode(' and ', $sources).'.';
        }
    }

    return $failures;
}

/**
 * Moves one class through move.php and fails when the file did not move or its old name is still named anywhere.
 *
 * @param  array<string, mixed>  $row
 */
function moveClass(string $root, array $row): string|null
{
    $command = [PHP_BINARY, dirname(__DIR__).'/move.php', $row['old_class'], $row['final_class']];
    exec(implode(' ', array_map('escapeshellarg', $command)).' 2>&1', $output, $exit);

    if ($exit !== 0 || file_exists("{$root}/{$row['old_path']}") || ! file_exists("{$root}/{$row['final_path']}")) {
        return "move.php did not move {$row['old_class']} to {$row['final_path']}: ".implode(' ', array_slice($output, -3));
    }

    $residual = trim((string) shell_exec(
        'cd '.escapeshellarg($root).' && git grep -l -F '.escapeshellarg($row['old_class']).' -- app domain tests routes config database bootstrap',
    ));

    return $residual === '' ? null : "{$row['old_class']} is still named in: ".str_replace("\n", ', ', $residual).'.';
}

/**
 * Moves one file that is no class with git mv, then rewrites its old path in the files its row lists.
 *
 * @param  array<string, mixed>  $row
 */
function moveFile(string $root, array $row): string|null
{
    $folder = dirname("{$root}/{$row['final_path']}");

    if (! is_dir($folder) && ! mkdir($folder, 0777, true)) {
        return "The folder of {$row['final_path']} could not be made.";
    }

    exec('cd '.escapeshellarg($root).' && git mv '.escapeshellarg($row['old_path']).' '.escapeshellarg($row['final_path']).' 2>&1', $output, $exit);

    if ($exit !== 0) {
        return "git mv refused {$row['old_path']}: ".implode(' ', $output);
    }

    foreach ($row['literal_references'] ?? [] as $file) {
        $text = (string) file_get_contents("{$root}/{$file}");

        if (! str_contains($text, $row['old_path'])) {
            return "{$file} was listed as naming {$row['old_path']}, but does not.";
        }

        file_put_contents("{$root}/{$file}", str_replace($row['old_path'], $row['final_path'], $text));
    }

    return null;
}

/**
 * Applies the same batch in a throwaway checkout of HEAD and reports what it would do, leaving the tree alone.
 *
 * @param  list<string>  $argv
 */
function rehearse(string $root, array $argv): int
{
    $checkout = sys_get_temp_dir().'/layout-rehearsal-'.bin2hex(random_bytes(4));
    exec('cd '.escapeshellarg($root).' && git worktree add --detach '.escapeshellarg($checkout).' HEAD 2>&1', $output, $exit);

    if ($exit !== 0) {
        return failWith(['The rehearsal checkout could not be made: '.implode(' ', $output)]);
    }

    $arguments = array_filter(array_slice($argv, 1), fn (string $argument) => $argument !== '--rehearse' && ! str_starts_with($argument, '--root=') && ! str_starts_with($argument, '--state='));
    $command = [PHP_BINARY, __FILE__, ...$arguments, '--root='.$checkout, '--state='.$checkout.'/rehearsal-state.json'];
    passthru(implode(' ', array_map('escapeshellarg', $command)), $result);
    exec('cd '.escapeshellarg($root).' && git worktree remove --force '.escapeshellarg($checkout));

    return $result;
}

/**
 * @param  list<array<string, mixed>>  $rows
 * @param  list<string>  $selectors
 * @return list<array<string, mixed>>
 */
function selectRows(array $rows, array $selectors): array
{
    if ($selectors === []) {
        return $rows;
    }

    return array_values(array_filter($rows, function (array $row) use ($selectors): bool {
        foreach ($selectors as $selector) {
            if (str_starts_with($row['old_path'], $selector)) {
                return true;
            }
        }

        return false;
    }));
}

/**
 * @param  list<array<string, mixed>>  $rows
 * @return array<string, mixed>|null
 */
function rowOf(array $rows, string $oldPath): array|null
{
    static $index = null;
    $index ??= array_column($rows, null, 'old_path');

    return $index[$oldPath] ?? null;
}

/**
 * @return array<string, string>
 */
function trackedBlobs(string $root): array
{
    $listing = (string) shell_exec('cd '.escapeshellarg($root).' && git ls-files -c -o --exclude-standard 2>/dev/null');

    return blobsOf($root, array_values(array_unique(array_filter(explode("\n", $listing)))));
}

/**
 * @return list<string>
 */
function existingFiles(string $root): array
{
    return array_values(array_filter(explode("\n", (string) shell_exec('cd '.escapeshellarg($root).' && git ls-files'))));
}

function blobOf(string $root, string $file): string|null
{
    return blobsOf($root, [$file])[$file] ?? null;
}

/**
 * The blob each file has now, hashed by one git process for all of them.
 *
 * @param  list<string>  $files
 * @return array<string, string>
 */
function blobsOf(string $root, array $files): array
{
    $present = array_values(array_filter($files, fn (string $file) => is_file("{$root}/{$file}")));
    // The paths go through a file: writing them all to git's input before reading its answers fills both pipes.
    $list = (string) tempnam(sys_get_temp_dir(), 'layout-paths-');
    file_put_contents($list, implode("\n", $present)."\n");
    $hashes = explode("\n", trim((string) shell_exec(
        'cd '.escapeshellarg($root).' && git hash-object --stdin-paths < '.escapeshellarg($list),
    )));
    unlink($list);

    return $present === [] ? [] : array_combine($present, $hashes);
}

/**
 * @param  list<string>  $arguments
 * @return array{manifest?: string, root?: string, state?: string, rows: list<string>, dry-run?: true, rehearse?: true}
 */
function optionsOf(array $arguments): array
{
    $options = ['rows' => []];

    foreach ($arguments as $argument) {
        if (str_starts_with($argument, '--rows=')) {
            $options['rows'][] = substr($argument, strlen('--rows='));
        } elseif (preg_match('/^--(root|state)=(.+)$/', $argument, $match) === 1) {
            $options[$match[1]] = $match[2];
        } elseif ($argument === '--dry-run' || $argument === '--rehearse') {
            $options[substr($argument, 2)] = true;
        } else {
            $options['manifest'] = $argument;
        }
    }

    return $options;
}

/**
 * @param  list<string>  $failures
 */
function failWith(array $failures): int
{
    fwrite(STDERR, 'fail: '.count($failures)." problems\n");

    foreach ($failures as $failure) {
        fwrite(STDERR, "- {$failure}\n");
    }

    return 1;
}
