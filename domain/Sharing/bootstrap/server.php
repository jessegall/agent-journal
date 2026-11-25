<?php

declare(strict_types=1);

/*
 * The router of the share-only listener: every request PHP's built-in server receives is handled by the share-only
 * application of domain/Sharing/bootstrap/app.php, never by the journal's own application, so nothing but share links answers on
 * the port a gateway forwards to.
 */

use Illuminate\Contracts\Http\Kernel;
use Illuminate\Http\Request;

require dirname(__DIR__, 3).'/vendor/autoload.php';

$app = require __DIR__.'/app.php';
$kernel = $app->make(Kernel::class);
$request = Request::capture();
$response = $kernel->handle($request);
$response->send();
$kernel->terminate($request, $response);
