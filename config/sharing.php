<?php

declare(strict_types=1);

$tunnels = env('SHARING_TUNNELS_DIR', storage_path('sharing'));

return [
    /*
    |--------------------------------------------------------------------------
    | Tunnels Dir
    |--------------------------------------------------------------------------
    |
    | The folder that holds every gateway's configuration folder: the root of
    | the file funnel's private place sharing-tunnels, so a gateway's folder
    | must lie inside it.
    |
    */

    'tunnels_dir' => $tunnels,

    /*
    |--------------------------------------------------------------------------
    | Rate Limit Store
    |--------------------------------------------------------------------------
    |
    | The cache store the public listener counts its rate limits in; Redis, so
    | every listener process shares them.
    |
    */

    'rate_limit_store' => env('SHARING_RATE_LIMIT_STORE', 'redis'),

    /*
    |--------------------------------------------------------------------------
    | Tunler
    |--------------------------------------------------------------------------
    |
    | The Tunler gateway: its pinned program, the configuration folder kept
    | for the journal alone (never a user's home), and the subdomain it opens,
    | the setting version 5 named journal.tunnels.tunler.subdomain.
    |
    */

    'tunler' => [
        'binary' => env('SHARING_TUNLER_BINARY', '/opt/sharing/bin/tunler'),
        'config_dir' => env('SHARING_TUNLER_CONFIG_DIR', "{$tunnels}/tunler"),
        'subdomain' => env('SHARING_TUNLER_SUBDOMAIN'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Ngrok
    |--------------------------------------------------------------------------
    |
    | The ngrok gateway: its pinned program, the journal's own configuration
    | folder and the loopback port of its control API.
    |
    */

    'ngrok' => [
        'binary' => env('SHARING_NGROK_BINARY', '/opt/sharing/bin/ngrok'),
        'config_dir' => env('SHARING_NGROK_CONFIG_DIR', "{$tunnels}/ngrok"),
        'control_port' => (int) env('SHARING_NGROK_CONTROL_PORT', 4041),
    ],

    /*
    |--------------------------------------------------------------------------
    | Secrets Dir
    |--------------------------------------------------------------------------
    |
    | The gateways' secrets, one file per secret reference, readable by the
    | share service alone.
    |
    */

    'secrets_dir' => env('SHARING_SECRETS_DIR', storage_path('sharing/secrets')),

    /*
    |--------------------------------------------------------------------------
    | Listener
    |--------------------------------------------------------------------------
    |
    | The share-only listener: it serves public share links and nothing else,
    | on loopback inside its container, on its own port. Gateways forward only
    | there.
    |
    */

    'listener' => [
        'host' => '127.0.0.1',
        'port' => (int) env('SHARING_LISTENER_PORT', 8090),
    ],

    /*
    |--------------------------------------------------------------------------
    | Timers
    |--------------------------------------------------------------------------
    |
    | How often the sharing supervisor checks the gateways' health, expires
    | shares and prunes the audit, in seconds.
    |
    */

    'timers' => [
        'health_seconds' => 15,
        'expiry_seconds' => 60,
        'audit_prune_seconds' => 86_400,
    ],
];
