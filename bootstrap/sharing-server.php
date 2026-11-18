<?php

declare(strict_types=1);

/*
 * The router of the share-only listener: every request PHP's built-in server receives is handled by the share-only
 * application of bootstrap/sharing.php, never by the journal's own application, so nothing but share links answers on
 * the port a gateway forwards to.
 */

use Illuminate\Contracts\Http\Kernel;
use Illuminate\Http\Request;

require dirname(__DIR__).'/vendor/autoload.php';

$app = require __DIR__.'/sharing.php';
$kernel = $app->make(Kernel::class);
$request = Request::capture();
$response = $kernel->handle($request);
$response->send();
$kernel->terminate($request, $response);
