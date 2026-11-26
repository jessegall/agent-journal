<?php

declare(strict_types=1);

/*
 * Runs the tests of the paths it is given in one parallel run: no path runs every test, one path runs it as artisan
 * test does, and several paths run through one temporary configuration that lists them all.
 *
 *   composer test:run
 *   composer test:run -- tests/Machinery/Hooks
 *   composer test:run -- tests/Hooks/ClaudeCodeHooksTest.php tests/Unit/Hooks/DecisionTest.php
 */

$root = dirname(__DIR__, 2);

require $root.'/vendor/autoload.php';
require __DIR__.'/test-runs.php';

$environment = [...getenv(), 'APP_ENV' => 'testing'];
$arguments = array_slice($_SERVER['argv'] ?? [], 1);
$paths = array_values(array_filter($arguments, fn (string $argument) => ! str_starts_with($argument, '-')));
$options = array_values(array_filter($arguments, fn (string $argument) => str_starts_with($argument, '-')));
$processes = processesFor($root, $options, $paths);
$otherOptions = array_values(array_filter($options, fn (string $option) => ! str_starts_with($option, '--processes=')));
$command = ['php', 'artisan', 'test', '--parallel', "--processes={$processes}", ...$otherOptions];
$heldDatabases = prepareWorkerDatabases($root, $environment, $processes);

if (count($paths) <= 1) {
    exit((int) run([...$command, ...$paths], $environment, $root, false));
}

$configuration = configurationFor($root, $paths);
$exitCode = (int) run([...$command, "--configuration={$configuration}"], $environment, $root, false);
@unlink($configuration);
exit($exitCode);
