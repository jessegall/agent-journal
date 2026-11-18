<?php

declare(strict_types=1);

return [
    /*
     * The share-only listener: it serves public share links and nothing else, on loopback inside its container, on
     * its own port. Gateways forward only there.
     */
    /*
     * The cache store the public listener counts its rate limits in; Redis, so every listener process shares them.
     */
    'rate_limit_store' => env('SHARING_RATE_LIMIT_STORE', 'redis'),

    'listener' => [
        'host' => '127.0.0.1',
        'port' => (int) env('SHARING_LISTENER_PORT', 8090),
    ],
];
