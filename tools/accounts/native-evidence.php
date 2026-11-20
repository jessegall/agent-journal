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

    public function succeeded(): bool
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
        public bool $signedIn,
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

    public function isPinnedBy(ProgramCompatibility $compatibility): bool
    {
        return $this->version === $compatibility->version && $compatibility->isPinnedBinary($this->digest);
    }
}

/**
 * @param  list<string>  $arguments
 * @return array{
 *     program: string,
 *     accounts_root: string|null,
 *     account_a: string|null,
 *     account_b: string|null,
 *     allow_requests: bool,
 *     host_agent: string|null,
 *     host_state: string|null,
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
        'host_agent' => null,
        'host_state' => null,
    ];

    foreach ($arguments as $argument) {
        [$name, $value] = array_pad(explode('=', $argument, 2), 2, '');
        match ($name) {
            '--program' => $options['program'] = $value,
            '--accounts-root' => $options['accounts_root'] = $value,
            '--account-a' => $options['account_a'] = $value,
            '--account-b' => $options['account_b'] = $value,
            '--allow-requests' => $options['allow_requests'] = true,
            '--host' => $options['host_agent'] = $value,
            '--host-state' => $options['host_state'] = $value,
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
 * One item a boundary part the protected host reports: pass only when the host enforces it with recorded native
 * evidence, missing with the host's own reason otherwise, and one missing item when no host was named.
 *
 * @return list<array{item: string, result: string, reason: string, consumer: string}>
 */
function protected_host_items(string|null $hostAgent, string|null $hostState, string $program, string $build): array
{
    if ($hostAgent === null) {
        return [item('protected-host', 'missing', 'name the protected host with --host=<journal-agent>', 'task 258')];
    }

    $command = [$hostAgent, 'protection', '--program', $program, '--build', $build];

    if ($hostState !== null) {
        array_push($command, '--state', $hostState);
    }

    $report = json_decode(run_program($command, ['PATH' => (string) getenv('PATH')], sys_get_temp_dir())->stdout, true);

    if (! is_array($report) || ! is_array($report['items'] ?? null)) {
        return [item('protected-host', 'missing', 'the protected host gave no protection report', 'task 258')];
    }

    return array_map(
        fn (array $part) => $part['enforced'] === true
            ? item('host-'.$part['item'], 'pass', (string) $part['evidence'], 'task 258')
            : item('host-'.$part['item'], 'missing', (string) $part['reason'], 'task 258'),
        $report['items'],
    );
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
function print_evidence(ProgramCompatibility $compatibility, InstalledBuild $installed, array $items): void
{
    echo json_encode([
        'program' => $compatibility->program->value,
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
function pinned_build_item(ProgramCompatibility $compatibility, InstalledBuild $installed, string $consumer): array
{
    $pinned = $installed->isPinnedBy($compatibility);

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
