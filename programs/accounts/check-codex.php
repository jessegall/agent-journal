<?php

declare(strict_types=1);

/*
 * The private native evidence procedure for Codex (docs/accounts/codex-native-evidence.md). It runs on the protected
 * host against accounts a user signed in through the journal's own sign-in, never a personal login, and prints
 * only each item's pass, missing or fail with its reason, the build and the arrangement.
 *
 *   php programs/accounts/check-codex.php [--program=codex] [--accounts-root=<journal accounts folder>]
 *       [--account-a=<account directory>] [--account-b=<account directory>]
 */

use App\Agents\Drivers\DefaultDrivers;
use App\Support\Compatibility\DriverCompatibility;

use function Tools\Accounts\empty_folder;
use function Tools\Accounts\installed_build;
use function Tools\Accounts\journal_account;
use function Tools\Accounts\judged;
use function Tools\Accounts\missing;
use function Tools\Accounts\pinned_build_item;
use function Tools\Accounts\pinned_version;
use function Tools\Accounts\print_evidence;
use function Tools\Accounts\read_options;
use function Tools\Accounts\run_program;

require __DIR__.'/../../vendor/autoload.php';
require __DIR__.'/native-evidence.php';

$compatibility = DriverCompatibility::pinned(DefaultDrivers::CODEX, pinned_version(DefaultDrivers::CODEX));
$options = read_options(array_slice($argv, 1), 'codex');
$program = $options['program'];
$accountA = journal_account($options['accounts_root'], $options['account_a']);
$accountB = journal_account($options['accounts_root'], $options['account_b']);
$home = empty_folder('home');

// Every run gets only the path, an empty home and the account's CODEX_HOME.
$environment = fn (string $codexHome) => [
    'PATH' => (string) getenv('PATH'),
    'HOME' => $home,
    'CODEX_HOME' => $codexHome,
];

// Only the exit of login status is kept: zero is signed in.
$signedIn = fn (string $codexHome): bool => run_program([
    $program,
    'login',
    'status',
], $environment($codexHome), $home)->hasSucceeded();

// The account keeps its sign-in in its own auth.json: the file setting is in its config.toml and the file exists.
$usesFileStore = function (string $codexHome) use ($compatibility): bool {
    $config = (string) @file_get_contents($codexHome.'/config.toml');
    $setting = $compatibility->settings['cli_auth_credentials_store'];

    return preg_match('/^\s*cli_auth_credentials_store\s*=\s*"'.$setting.'"\s*$/m', $config) === 1
        && is_file($codexHome.'/auth.json');
};

// Whether `codex mcp list` in the folder loads the MCP server only the work folder's .codex/config.toml names.
$loadsWorkFolderServer = function (string $workingRoot, string $trusted) use ($program, $environment): bool {
    $codexHome = empty_folder('config-home');
    file_put_contents($codexHome.'/config.toml', "[projects.\"{$trusted}\"]\ntrust_level = \"trusted\"\n");

    $servers = run_program([$program, 'mcp', 'list'], $environment($codexHome), $workingRoot)->stdout;

    return str_contains($servers, 'hostile');
};

$version = run_program([$program, '--version'], $environment(empty_folder('version')), $home)->stdout;
$installed = installed_build($program, $version);
$help = run_program([$program, '--help'], $environment(empty_folder('help')), $home)->stdout
    .run_program([$program, 'exec', '--help'], $environment(empty_folder('exec-help')), $home)->stdout;
$absentFlags = array_filter($compatibility->startFlags, fn (string $flag) => ! str_contains($help, $flag));

$work = (string) realpath(empty_folder('work'));
$root = (string) realpath(empty_folder('root'));
mkdir($work.'/.codex');
file_put_contents($work.'/.codex/config.toml', "[mcp_servers.hostile]\ncommand = \"true\"\n");

$items = [
    pinned_build_item($compatibility, $installed, 'task 252'),
    judged('start-flags', $absentFlags === [], 'the help names every start flag', 'a flag is absent', 'task 240'),
    judged('empty-account-signed-out', ! $signedIn(empty_folder('empty')), 'no credential', 'signed in', 'task 240'),
    judged(
        'trusted-work-folder-loads-its-config',
        $loadsWorkFolderServer($work, $work),
        'trusting a work folder loads its own .codex/config.toml, as captured',
        'a trusted work folder did not load its config, so the next item proves nothing',
        'task 242',
    ),
    judged(
        'empty-root-excludes-work-folder-config',
        ! $loadsWorkFolderServer($root, $root),
        'a trusted empty working root loads nothing from the work folder',
        'the work folder configuration reached the empty root',
        'task 242',
    ),
];

$signedInA = $accountA !== null && $signedIn($accountA);
$signedInB = $accountB !== null && $signedIn($accountB);

foreach ([
    'a' => [
        $accountA,
        $signedInA,
    ],
    'b' => [
        $accountB,
        $signedInB,
    ],
] as $name => [$account, $isSignedIn]) {
    $items[] = $account === null
        ? missing("account-{$name}-signed-in", "a journal account {$name} signed in through the host", 'task 254')
        : judged("account-{$name}-signed-in", $isSignedIn, 'signed in', 'not signed in', 'task 254');
    $items[] = $isSignedIn
        ? judged("account-{$name}-file-store", $usesFileStore($account), 'own auth.json', 'no file store', 'task 230')
        : missing("account-{$name}-file-store", "a signed-in journal account {$name}", 'task 230');
}

$items[] = $signedInA
    ? judged('sign-in-survives-restart', $signedIn($accountA), 'a new process is signed in', 'signed out', 'task 247')
    : missing('sign-in-survives-restart', 'a signed-in journal account A', 'task 247');

$items[] = missing('accounts-separate', 'an account/read identity check through the shared owner', 'task 254');
$items[] = missing('hooks-run-in-empty-root', 'a signed-in thread with the journal hooks', 'task 242');
$items[] = missing('thread-identities-and-cancellation', 'two threads on one owner, one interrupted', 'task 243');
$items[] = missing('parallel-refresh', 'two threads on one owner across a token refresh', 'task 243');
$items[] = missing('cleanup', 'removing a disposable signed-in account, then a folder check', 'task 246');
$items[] = missing('outage-keeps-denials', 'a protected start while the journal is unreachable', 'task 263');

print_evidence($compatibility, $installed, [
    ...$items,
]);
