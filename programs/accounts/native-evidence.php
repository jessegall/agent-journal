<?php

declare(strict_types=1);

/*
 * What both native evidence procedures share: reading their options, refusing any account directory outside the
 * journal's own accounts folder, running the pinned program with only the environment it is given, and printing one
 * result per item. Nothing here prints a program's output, a challenge or a credential.
 */

namespace Tools\Accounts;

use App\Support\Compatibility\DriverCompatibility;
use RuntimeException;

const PASS = 'pass';
const MISSING = 'missing';
const FAIL = 'fail';

/**
 * A refusal of the evidence procedure: an option it does not know, an account outside the journal's accounts
 * folder, or a program that would not start.
 */
final class EvidenceRefused extends RuntimeException
{
    public static function unknownOption(string $name): self
    {
        return new self(sprintf('Unknown option %s.', $name));
    }

    public static function accountOutsideJournal(): self
    {
        return new self('An account directory must lie inside the journal accounts folder.');
    }

    public static function notStarted(string $program): self
    {
        return new self(sprintf('%s could not be started.', $program));
    }
}

/**
 * One run of a program: its exit code and its standard output.
 */
final readonly class ProgramRun
{
    public function __construct(
        public int $exit,
        public string $stdout,
    ) {}

    public function hasSucceeded(): bool
    {
        return $this->exit === 0;
    }
}

/**
 * Whether an account is signed in, with a digest of its identity when its program names one.
 */
final readonly class AccountStatus
{
    public function __construct(
        public bool $isSignedIn,
        public string|null $identityDigest,
    ) {}
}

/**
 * The installed build of a program: its version number and the sha256 of its binary.
 */
final readonly class InstalledBuild
{
    public function __construct(
        public string $version,
        public string $digest,
    ) {}

    public function isPinnedBy(DriverCompatibility $compatibility): bool
    {
        return $this->version === $compatibility->version && $compatibility->isPinnedBinary($this->digest);
    }
}

/**
 * The driver's pinned build, from its image folder's VERSION file: the one place a driver's version is written.
 */
function pinned_version(string $family): string
{
    return trim((string) file_get_contents(__DIR__."/../../.docker/drivers/{$family}/VERSION"));
}

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
            default => throw EvidenceRefused::unknownOption($name),
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
        throw EvidenceRefused::accountOutsideJournal();
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

        if (is_dir($path) && ! is_link($path)) {
            remove_folder($path);
        } else {
            unlink($path);
        }
    }

    rmdir($folder);
}

/**
 * Runs the program with exactly this environment and answers its exit code and standard output; standard error is
 * dropped unread.
 *
 * @param  list<string>  $command
 * @param  array<string, string>  $environment
 */
function run_program(array $command, array $environment, string $workingDirectory): ProgramRun
{
    $streams = [1 => ['pipe', 'w'], 2 => ['file', '/dev/null', 'w']];
    $process = proc_open($command, $streams, $pipes, $workingDirectory, $environment);

    if (! is_resource($process)) {
        throw EvidenceRefused::notStarted($command[0]);
    }

    $stdout = (string) stream_get_contents($pipes[1]);
    fclose($pipes[1]);

    return new ProgramRun(proc_close($process), $stdout);
}

/**
 * @return array{item: string, result: string, reason: string, consumer: string}
 */
function item(string $id, string $result, string $reason, string $consumer): array
{
    return [
        'item' => $id,
        'result' => $result,
        'reason' => $reason,
        'consumer' => $consumer,
    ];
}

/**
 * The installed build: its version line's number and the sha256 of the binary the command resolves to.
 */
function installed_build(string $program, string $versionOutput): InstalledBuild
{
    preg_match('/\d+\.\d+\.\d+/', $versionOutput, $version);
    $path = str_contains($program, '/') ? $program : trim((string) shell_exec('command -v '.escapeshellarg($program)));
    $binary = realpath($path);

    return new InstalledBuild(
        $version[0] ?? 'unknown',
        $binary === false ? 'unknown' : (string) hash_file('sha256', $binary),
    );
}

/**
 * @param  list<array{item: string, result: string, reason: string, consumer: string}>  $items
 */
function print_evidence(DriverCompatibility $compatibility, InstalledBuild $installed, array $items): void
{
    echo json_encode([
        'driver' => $compatibility->driver,
        'version' => $installed->version,
        'binary_sha256' => $installed->digest,
        'arrangement' => $compatibility->arrangement->value,
        'items' => $items,
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR).PHP_EOL;
}

/**
 * Whether the installed build is the pinned one, as the first item of every procedure.
 *
 * @return array{item: string, result: string, reason: string, consumer: string}
 */
function pinned_build_item(DriverCompatibility $compatibility, InstalledBuild $installed, string $consumer): array
{
    $pinned = $installed->isPinnedBy($compatibility);

    return judged('pinned-build', $pinned, 'the installed binary is the pinned build', 'another build', $consumer);
}

/**
 * A pass or a fail, each with its own reason.
 *
 * @return array{item: string, result: string, reason: string, consumer: string}
 */
function judged(string $id, bool $hasPassed, string $passReason, string $failReason, string $consumer): array
{
    return item($id, $hasPassed ? PASS : FAIL, $hasPassed ? $passReason : $failReason, $consumer);
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
