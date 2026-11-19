<?php

declare(strict_types=1);

/*
 * What both native evidence procedures share: reading their options, refusing any account directory outside the
 * journal's own accounts folder, running the pinned program with only the environment it is given, and printing one
 * result per item. Nothing here prints a program's output, a challenge or a credential.
 */

namespace Tools\Accounts;

use App\Hooks\Support\ProgramCompatibility;
use RuntimeException;

const PASS = 'pass';
const MISSING = 'missing';
const FAIL = 'fail';

/**
 * @param  list<string>  $arguments
 * @return array{
 *     program: string,
 *     accounts_root: string|null,
 *     account_a: string|null,
 *     account_b: string|null,
 *     allow_requests: bool,
 * }
 */
function read_options(array $arguments, string $defaultProgram): array
{
    $options = [
        'program' => $defaultProgram,
        'accounts_root' => getenv('JOURNAL_ACCOUNTS_ROOT') ?: null,
        'account_a' => null,
        'account_b' => null,
        'allow_requests' => false,
    ];

    foreach ($arguments as $argument) {
        [$name, $value] = array_pad(explode('=', $argument, 2), 2, '');
        match ($name) {
            '--program' => $options['program'] = $value,
            '--accounts-root' => $options['accounts_root'] = $value,
            '--account-a' => $options['account_a'] = $value,
            '--account-b' => $options['account_b'] = $value,
            '--allow-requests' => $options['allow_requests'] = true,
            default => throw new RuntimeException("Unknown option {$name}."),
        };
    }

    return $options;
}

/**
 * The account directory, resolved, when it lies inside the journal's accounts folder; a personal login is never read.
 */
function journal_account(string|null $accountsRoot, string|null $directory): string|null
{
    if ($directory === null) {
        return null;
    }

    $root = $accountsRoot === null ? false : realpath($accountsRoot);
    $resolved = realpath($directory);

    if ($root === false || $resolved === false || ! str_starts_with($resolved, $root.DIRECTORY_SEPARATOR)) {
        throw new RuntimeException('An account directory must lie inside the journal accounts folder.');
    }

    return $resolved;
}

/**
 * A new empty folder that is removed when the procedure ends.
 */
function empty_folder(string $purpose): string
{
    $folder = sys_get_temp_dir().'/journal-evidence-'.$purpose.'-'.bin2hex(random_bytes(6));
    mkdir($folder, 0700);
    register_shutdown_function(fn () => remove_folder($folder));

    return $folder;
}

function remove_folder(string $folder): void
{
    if (! is_dir($folder)) {
        return;
    }

    foreach (array_diff((array) scandir($folder), ['.', '..']) as $name) {
        $path = $folder.'/'.$name;
        is_dir($path) && ! is_link($path) ? remove_folder($path) : unlink($path);
    }

    rmdir($folder);
}

/**
 * Runs the program with exactly this environment and answers its exit code and standard output; standard error is
 * dropped unread.
 *
 * @param  list<string>  $command
 * @param  array<string, string>  $environment
 * @return array{exit: int, stdout: string}
 */
function run_program(array $command, array $environment, string $workingDirectory): array
{
    $streams = [1 => ['pipe', 'w'], 2 => ['file', '/dev/null', 'w']];
    $process = proc_open($command, $streams, $pipes, $workingDirectory, $environment);

    if (! is_resource($process)) {
        throw new RuntimeException("{$command[0]} could not be started.");
    }

    $stdout = (string) stream_get_contents($pipes[1]);
    fclose($pipes[1]);

    return ['exit' => proc_close($process), 'stdout' => $stdout];
}

/**
 * @return array{item: string, result: string, reason: string, consumer: string}
 */
function item(string $id, string $result, string $reason, string $consumer): array
{
    return ['item' => $id, 'result' => $result, 'reason' => $reason, 'consumer' => $consumer];
}

/**
 * The installed build: its version line's number and the sha256 of the binary the command resolves to.
 *
 * @return array{version: string, digest: string}
 */
function installed_build(string $program, string $versionOutput): array
{
    preg_match('/\d+\.\d+\.\d+/', $versionOutput, $version);
    $path = str_contains($program, '/') ? $program : trim((string) shell_exec('command -v '.escapeshellarg($program)));
    $binary = realpath($path);

    return [
        'version' => $version[0] ?? 'unknown',
        'digest' => $binary === false ? 'unknown' : (string) hash_file('sha256', $binary),
    ];
}

/**
 * @param  array{version: string, digest: string}  $installed
 * @param  list<array{item: string, result: string, reason: string, consumer: string}>  $items
 */
function print_evidence(ProgramCompatibility $compatibility, array $installed, array $items): void
{
    echo json_encode([
        'program' => $compatibility->program->value,
        'version' => $installed['version'],
        'binary_sha256' => $installed['digest'],
        'arrangement' => $compatibility->arrangement->value,
        'items' => $items,
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR).PHP_EOL;
}

/**
 * Whether the installed build is the pinned one, as the first item of every procedure.
 *
 * @param  array{version: string, digest: string}  $installed
 * @return array{item: string, result: string, reason: string, consumer: string}
 */
function pinned_build_item(ProgramCompatibility $compatibility, array $installed, string $consumer): array
{
    $pinned = $installed['version'] === $compatibility->version && $compatibility->isPinnedBinary($installed['digest']);

    return judged('pinned-build', $pinned, 'the installed binary is the pinned build', 'another build', $consumer);
}

/**
 * A pass or a fail, each with its own reason.
 *
 * @return array{item: string, result: string, reason: string, consumer: string}
 */
function judged(string $id, bool $passed, string $passReason, string $failReason, string $consumer): array
{
    return item($id, $passed ? PASS : FAIL, $passed ? $passReason : $failReason, $consumer);
}

/**
 * An item whose prerequisite is missing, with what it needs.
 *
 * @return array{item: string, result: string, reason: string, consumer: string}
 */
function missing(string $id, string $needs, string $consumer): array
{
    return item($id, MISSING, $needs, $consumer);
}
