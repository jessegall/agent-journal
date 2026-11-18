<?php

declare(strict_types=1);

use App\Domains\Support\DomainRegistry;
use Illuminate\Contracts\Console\Kernel;
use Tests\Support\AffectedTests;

/*
 * Runs only the tests the changed files can break. Without arguments it reads the changes git sees (staged, unstaged
 * and untracked); --since=<commit> reads what changed since that commit; file paths name the changes themselves.
 *
 *   composer test:affected
 *   composer test:affected -- --since=main
 *   composer test:affected -- domain/Rules/src/Commands/ApproveRule.php
 */

$root = dirname(__DIR__, 2);

require $root.'/vendor/autoload.php';

$app = require $root.'/bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();

$arguments = array_slice($_SERVER['argv'] ?? [], 1);
$since = null;
$files = [];

foreach ($arguments as $argument) {
    if (str_starts_with($argument, '--since=')) {
        $since = substr($argument, 8);

        continue;
    }

    $files[] = $argument;
}

if ($files === []) {
    $git = static function (string $command) use ($root): array {
        exec('git -C '.escapeshellarg($root).' '.$command, $lines);

        return $lines;
    };

    $files = $since === null
        ? [...$git('diff --name-only HEAD'), ...$git('ls-files --others --exclude-standard')]
        : $git('diff --name-only '.escapeshellarg($since));
}

$files = array_values(array_unique(array_filter($files)));

if ($files === []) {
    fwrite(STDOUT, "Nothing changed, so no test runs.\n");
    exit(0);
}

$folders = (new AffectedTests($app->make(DomainRegistry::class), $root))->for($files);

fwrite(STDOUT, $folders === AffectedTests::EVERYTHING
    ? "A change outside every domain: every test runs.\n"
    : 'Running the tests of: '.implode(', ', $folders)."\n");

passthru(implode(' ', array_map(escapeshellarg(...), ['php', 'artisan', 'test', ...$folders])), $exitCode);
exit($exitCode);
