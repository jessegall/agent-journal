<?php

declare(strict_types=1);

use Illuminate\Contracts\Console\Kernel;
use Tests\Support\HookDatabase;

/*
 * Prints the fingerprint of every migration file the application runs, the one a migrated test database is stamped
 * with, so a run knows whether its template database is still current.
 */

$root = dirname(__DIR__, 2);

require $root.'/vendor/autoload.php';

$app = require $root.'/bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();

fwrite(STDOUT, HookDatabase::migrationFingerprint($app));
