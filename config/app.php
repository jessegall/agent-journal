<?php

declare(strict_types=1);

return [

    // Application Name: the name the framework places in a notification or anywhere else the application is named.

    'name' => env('APP_NAME', 'Laravel'),

    // Application Environment: This value determines the "environment" your application is currently running in.

    'env' => env('APP_ENV', 'production'),

    // Application Debug Mode: When your application is in debug mode, detailed error messages with stack traces will be
    // shown on every error that occurs within your application.

    'debug' => (bool) env('APP_DEBUG', false),

    // Application URL: This URL is used by the console to properly generate URLs when using the Artisan command line
    // tool.

    'url' => env('APP_URL', 'http://localhost'),

    // Application Timezone: Here you may specify the default timezone for your application, which will be used by the
    // PHP date and date-time functions.

    'timezone' => 'UTC',

    // Application Locale Configuration: The application locale determines the default locale that will be used by
    // Laravel's translation / localization methods.

    'locale' => env('APP_LOCALE', 'en'),

    'fallback_locale' => env('APP_FALLBACK_LOCALE', 'en'),

    'faker_locale' => env('APP_FAKER_LOCALE', 'en_US'),

    // Encryption Key: This key is utilized by Laravel's encryption services and should be set to a random, 32 character
    // string to ensure that all encrypted values are secure.

    'cipher' => 'AES-256-CBC',

    'key' => env('APP_KEY'),

    'previous_keys' => [
        ...array_filter(
            explode(',', (string) env('APP_PREVIOUS_KEYS', '')),
        ),
    ],

    // Maintenance Mode Driver: These configuration options determine the driver used to determine and manage Laravel's
    // "maintenance mode" status.

    'maintenance' => [
        'driver' => env('APP_MAINTENANCE_DRIVER', 'file'),
        'store' => env('APP_MAINTENANCE_STORE', 'redis'),
    ],

];
