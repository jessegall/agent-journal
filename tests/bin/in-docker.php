<?php

declare(strict_types=1);

/*
 * Runs a composer script inside the project's queue container: on the host it hands the script and its arguments to
 * docker compose; inside the container it runs the script directly. The tests have no database outside Docker.
 */
$script = $argv[1] ?? throw new InvalidArgumentException('Name the composer script to run.');
$arguments = array_slice($argv, 2);
$command = ['composer', 'run-script', $script, '--', ...$arguments];

if (! file_exists('/.dockerenv')) {
    $command = ['docker', 'compose', '-p', 'agent-journal-6', 'exec', '-T', 'queue', ...$command];
}

$process = proc_open($command, [STDIN, STDOUT, STDERR], $pipes, dirname(__DIR__, 2));

exit(is_resource($process) ? proc_close($process) : 1);
