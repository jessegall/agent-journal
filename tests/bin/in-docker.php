<?php

declare(strict_types=1);

/*
 * Runs a composer script inside the project's queue container: on the host it hands the script and its arguments to
 * docker compose; inside the container it runs the script directly. The tests have no database outside Docker.
 */
if (! isset($argv[1])) {
    fwrite(STDERR, "Name the composer script to run.\n");
    exit(2);
}

$script = $argv[1];
$arguments = array_slice($argv, 2);
$command = ['composer', 'run-script', $script, '--', ...$arguments];

$checkout = dirname(__DIR__, 2);
$worktreeAt = strpos($checkout, '/.journal/worktrees/');
$containerFolder = $worktreeAt === false ? '/app' : '/app'.substr($checkout, $worktreeAt);

if (! file_exists('/.dockerenv') && $script === 'test:affected-inside') {
    $arguments = affectedArgumentsFromHost($checkout, $arguments);
    $command = ['composer', 'run-script', $script, '--', ...$arguments];
}

if (! file_exists('/.dockerenv')) {
    $command = [
        'docker',
        'compose',
        '-p',
        'agent-journal-6',
        'exec',
        '-T',
        ...worktreeDatabase($checkout, $worktreeAt),
        '-w',
        $containerFolder,
        'queue',
        ...$command,
    ];
}

$process = proc_open($command, [STDIN, STDOUT, STDERR], $pipes, $checkout);

exit(is_resource($process) ? proc_close($process) : 1);

/**
 * Each run in a worktree gets a database of its own, journal_hooks_test_wt_<folder>r<run>, so two runs of one
 * worktree, such as two checkpoints, never share rows; the run drops it and its parallel copies when it ends. The main
 * checkout keeps the default.
 *
 * @return list<string>
 */
function worktreeDatabase(string $checkout, int|false $worktreeAt): array
{
    if ($worktreeAt === false) {
        return [];
    }

    $folder = substr((string) preg_replace('/[^a-z0-9]/', '', strtolower(basename($checkout))), 0, 20);
    $database = sprintf('journal_hooks_test_wt_%sr%s', $folder, bin2hex(random_bytes(4)));

    return ['-e', 'DB_DATABASE='.$database, '-e', 'JOURNAL_DROP_RUN_DATABASE=1'];
}

/**
 * The container has no git, so the host names the changed files: the ones given, or those git finds since the
 * revision --since names, else those changed or added since HEAD; --none when nothing changed.
 *
 * @param  list<string>  $arguments
 * @return list<string>
 */
function affectedArgumentsFromHost(string $checkout, array $arguments): array
{
    $since = null;
    $named = [];

    foreach ($arguments as $argument) {
        if (str_starts_with($argument, '--since=')) {
            $since = substr($argument, 8);
        } else {
            $named[] = $argument;
        }
    }

    if ($named !== []) {
        return $named;
    }

    $git = static function (string $command) use ($checkout): array {
        exec('git -C '.escapeshellarg($checkout).' '.$command, $lines);

        return $lines;
    };
    $files = $since === null
        ? [...$git('diff --name-only HEAD'), ...$git('ls-files --others --exclude-standard')]
        : $git('diff --name-only '.escapeshellarg($since));

    return $files === [] ? ['--none'] : array_values(array_unique($files));
}
