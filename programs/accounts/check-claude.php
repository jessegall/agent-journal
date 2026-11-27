<?php

declare(strict_types=1);

/*
 * The private native evidence procedure for Claude Code (docs/accounts/claude-native-evidence.md). It runs on the
 * protected host against accounts a user signed in through the journal's own sign-in, never a personal login, and
 * prints only each item's pass, missing or fail with its reason, the build and the arrangement.
 *
 *   php programs/accounts/check-claude.php [--program=claude] [--accounts-root=<journal accounts folder>]
 *       [--account-a=<account directory>] [--account-b=<account directory>] [--allow-requests]
 *       [--host=<journal-runner>] [--host-state=<its state folder>]
 *
 * --allow-requests lets the hostile work settings item send one small request on account A.
 */

use App\Agents\Drivers\DefaultDrivers;
use App\Support\Compatibility\DriverCompatibility;
use Tools\Accounts\AccountStatus;

use function Tools\Accounts\empty_folder;
use function Tools\Accounts\installed_build;
use function Tools\Accounts\journal_account;
use function Tools\Accounts\judged;
use function Tools\Accounts\missing;
use function Tools\Accounts\pinned_build_item;
use function Tools\Accounts\print_evidence;
use function Tools\Accounts\protected_host_items;
use function Tools\Accounts\read_options;
use function Tools\Accounts\run_program;

require __DIR__.'/../../vendor/autoload.php';
require __DIR__.'/native-evidence.php';

$compatibility = DriverCompatibility::pinned(DefaultDrivers::CLAUDE_CODE);
$options = read_options(array_slice($argv, 1), 'claude');
$program = $options['program'];
$accountA = journal_account($options['accounts_root'], $options['account_a']);
$accountB = journal_account($options['accounts_root'], $options['account_b']);
$home = empty_folder('home');
$emptyAnthropic = empty_folder('anthropic');

// Every run gets only the path, an empty home, the account directory and an empty Anthropic folder.
$environment = fn (string $accountDirectory) => [
    'PATH' => (string) getenv('PATH'),
    'HOME' => $home,
    'CLAUDE_CONFIG_DIR' => $accountDirectory,
    'ANTHROPIC_CONFIG_DIR' => $emptyAnthropic,
];

// Of an account's status only whether it is signed in and a digest of its identity are kept.
$status = function (string $accountDirectory) use ($program, $environment, $home): AccountStatus {
    $run = run_program([$program, 'auth', 'status', '--json'], $environment($accountDirectory), $home);
    $report = json_decode($run->stdout, true) ?: [];
    $identity = $report['email'] ?? $report['orgId'] ?? null;

    return new AccountStatus(
        ($report['loggedIn'] ?? false) === true,
        is_string($identity) ? hash('sha256', $identity) : null,
    );
};

$version = run_program([$program, '--version'], $environment(empty_folder('version')), $home)->stdout;
$installed = installed_build($program, $version);
$help = run_program([$program, '--help'], $environment(empty_folder('help')), $home)->stdout;
$absentFlags = array_filter($compatibility->startFlags, fn (string $flag) => ! str_contains($help, $flag));
$signedOut = $status(empty_folder('signed-out'));

$items = [
    pinned_build_item($compatibility, $installed, 'task 252'),
    judged('start-flags', $absentFlags === [], 'the help names every start flag', 'a flag is absent', 'task 240'),
    judged('empty-account-signed-out', ! $signedOut->isSignedIn, 'no credential', 'it reported a sign-in', 'task 240'),
];

$statusA = $accountA === null ? null : $status($accountA);
$statusB = $accountB === null ? null : $status($accountB);

foreach ([
    'a' => $statusA,
    'b' => $statusB,
] as $name => $accountStatus) {
    $items[] = $accountStatus === null
        ? missing("account-{$name}-signed-in", "a journal account {$name} signed in through the host", 'task 253')
        : judged("account-{$name}-signed-in", $accountStatus->isSignedIn, 'signed in', 'not signed in', 'task 253');
}

$bothSignedIn = ($statusA?->isSignedIn ?? false) && ($statusB?->isSignedIn ?? false);
$items[] = match (true) {
    ! $bothSignedIn => missing('accounts-separate', 'two signed-in journal accounts', 'task 231'),
    $statusA->identityDigest === null || $statusB->identityDigest === null => missing('accounts-separate', 'an account identity in auth status', 'task 231'),
    default => judged(
        'accounts-separate',
        $statusA->identityDigest !== $statusB->identityDigest,
        'accounts A and B report different identities',
        'accounts A and B report the same identity',
        'task 231',
    ),
};

$restarted = ($statusA?->isSignedIn ?? false) && $accountA !== null ? $status($accountA) : null;
$items[] = $restarted === null
    ? missing('sign-in-survives-restart', 'a signed-in journal account A', 'task 247')
    : judged(
        'sign-in-survives-restart',
        $restarted->isSignedIn && $restarted->identityDigest === $statusA->identityDigest,
        'a new process finds account A signed in as before',
        'a new process does not find account A signed in as before',
        'task 247',
    );

$items[] = (function () use ($options, $statusA, $accountA, $program, $environment): array {
    if (! $options['allow_requests'] || ! ($statusA?->isSignedIn ?? false) || $accountA === null) {
        return missing('hostile-work-settings-ignored', 'a signed-in account A and --allow-requests', 'task 262');
    }

    $work = empty_folder('work');
    $marker = $work.'/hostile-hook-ran';
    $hook = ['type' => 'command', 'command' => 'touch '.escapeshellarg($marker)];
    mkdir($work.'/.claude');
    $hostileSettings = ['hooks' => ['SessionStart' => [['hooks' => [$hook]]]]];
    file_put_contents($work.'/.claude/settings.json', json_encode($hostileSettings));
    file_put_contents($work.'/settings.json', '{}');
    file_put_contents($work.'/mcp.json', '{"mcpServers":{}}');
    $command = [
        $program, '-p', '--restricted',
        '--strict-mcp-config', '--mcp-config', $work.'/mcp.json',
        '--settings', $work.'/settings.json',
        '--tools', '', '--no-session-persistence',
        'Reply with OK.',
    ];
    $run = run_program($command, $environment($accountA), $work);

    if ($run->hasSucceeded()) {
        return judged('hostile-work-settings-ignored', ! file_exists($marker), 'its hook stayed off', 'it ran', 'task 262');
    }

    return missing('hostile-work-settings-ignored', 'a restricted request that completes', 'task 262');
})();

$items[] = missing('keychain-cleanup', 'removing a disposable signed-in account, then a Keychain check', 'task 246');
$items[] = missing('parallel-refresh', 'two starts on one account across a token refresh', 'task 243');
$items[] = missing('own-output-and-foreign-denial', 'the protected starter with per-session output rules', 'task 262');
$items[] = missing('outage-keeps-denials', 'a protected start while the journal is unreachable', 'task 263');

print_evidence($compatibility, $installed, [
    ...$items,
    ...protected_host_items($options['host_agent'], $options['host_state'], 'claude', $compatibility->version),
]);
