<?php

declare(strict_types=1);

use Tests\Support\RequirePhaseTests;

require dirname(__DIR__, 2).'/vendor/autoload.php';

$options = getopt('', ['files:', 'full']);
$given = $options['files'] ?? null;

if (! is_string($given) || $given === '') {
    fwrite(STDERR, "Name the phase test files with --files=<comma-separated paths>.\n");
    exit(1);
}

$files = explode(',', $given);

$missing = RequirePhaseTests::missingTests($files);

if ($missing !== []) {
    fwrite(STDERR, 'These phase test files are missing or hold no test: '.implode(', ', $missing)."\n");
    exit(1);
}

passthru(implode(' ', array_map(escapeshellarg(...), RequirePhaseTests::command($files))), $exitCode);

if ($exitCode !== 0 || ! isset($options['full'])) {
    exit($exitCode);
}

passthru('composer test', $exitCode);
exit($exitCode);
