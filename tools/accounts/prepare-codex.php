<?php

declare(strict_types=1);

/*
 * Prepares a Codex account on the protected host for one more thread, without the server ever reading host paths.
 * It reads one JSON line: the account directory, the journal's working roots folder, the new root's name and the
 * hook tables the host generated. It makes the empty root, trusts exactly that root and adds the file sign-in store
 * and the hook tables to the account's config.toml under the account's short lock, keeping every entry already there,
 * so threads already running are left alone, and puts in the journal's MCP entry whole: this installation's PHP
 * running its bin/journal-mcp. The root is sealed read-only: no agent writes into it. It prints the
 * root's path.
 *
 *   echo '{"account":"...","working_roots":"...","root":"...","tables":["..."]}' | php tools/accounts/prepare-codex.php
 */

use App\Hooks\Programs\CodexFolderTrust;
use App\Hooks\Programs\CodexJournalServer;
use App\Hooks\Support\AccountConfigurationWrite;
use App\Hooks\Support\ProgramCompatibility;
use App\Programs\Enums\HookProgram;

require __DIR__.'/../../vendor/autoload.php';

$request = json_decode((string) fgets(STDIN), true, flags: JSON_THROW_ON_ERROR);
$workingRoots = realpath((string) $request['working_roots']);
$name = (string) $request['root'];

if ($workingRoots === false || $name === '' || basename($name) !== $name || in_array($name, ['.', '..'], true)) {
    fwrite(STDERR, "The working roots folder or the root's name is not usable.\n");
    exit(2);
}

$root = $workingRoots.'/'.$name;

if (! is_dir($root) && ! mkdir($root, 0o700)) {
    fwrite(STDERR, sprintf("The root %s could not be made.\n", $root));
    exit(1);
}

$settings = array_map(
    static fn (string $value): string => sprintf('"%s"', addcslashes($value, '"\\')),
    ProgramCompatibility::pinned(HookProgram::Codex)->settings,
);
new AccountConfigurationWrite()->prepare(
    (string) $request['account'],
    $settings,
    array_values(array_map(strval(...), (array) ($request['tables'] ?? []))),
    CodexFolderTrust::forWorkingRoot($workingRoots, $root),
    [CodexJournalServer::of(PHP_BINARY, (string) realpath(__DIR__.'/../../bin/journal-mcp'))->tomlTable()],
);
chmod($root, 0o555);

echo json_encode(['root' => $root]), "\n";
