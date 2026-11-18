<?php

declare(strict_types=1);

return [
    /*
     * The share-only listener: it serves public share links and nothing else, on loopback inside its container, on
     * its own port. Gateways forward only there.
     */
    'listener' => [
        'host' => '127.0.0.1',
        'port' => (int) env('SHARING_LISTENER_PORT', 8090),
    ],
];
