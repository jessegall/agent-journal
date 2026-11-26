<?php

declare(strict_types=1);

use App\Agents\Drivers\Contracts\DriverCompatibilities;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Tests\Fixtures\Drivers\ShownDriverArrangements;

// The journal a test host talks to: the app's own entry, with the driver arrangements the test showed in-process.
require __DIR__.'/../../../../vendor/autoload.php';

/** @var Application $app */
$app = require_once __DIR__.'/../../../../bootstrap/app.php';

if (getenv('TEST_SHOWS_DRIVER_ARRANGEMENTS') === '1') {
    $app->instance(DriverCompatibilities::class, new ShownDriverArrangements());
}

$app->handleRequest(Request::capture());
