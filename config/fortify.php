<?php

declare(strict_types=1);

use Laravel\Fortify\Features;

return [

    // Fortify Guard: Here you may specify which authentication guard Fortify will use while authenticating users.

    'guard' => 'web',

    // Fortify Password Broker: Here you may specify which password broker Fortify can use when a user is resetting
    // their password.

    'passwords' => 'users',

    // Username / Email: This value defines which model attribute should be considered as your application's "username"
    // field.

    'username' => 'email',

    'email' => 'email',

    // Lowercase Usernames: This value defines whether usernames should be lowercased before saving them in the
    // database, as some database system string fields are case sensitive.

    'lowercase_usernames' => true,

    // Home Path: Here you may configure the path where users will get redirected during authentication or password
    // reset when the operations are successful and the user is authenticated.

    'home' => '/',

    // Fortify Routes Prefix / Subdomain: Here you may specify which prefix Fortify will assign to all the routes that
    // it registers with the application.

    'prefix' => '',

    'domain' => null,

    // Fortify Routes Middleware: Here you may specify which middleware Fortify will assign to the routes that it
    // registers with the application.

    'middleware' => ['web'],

    // Rate Limiting: By default, Fortify will throttle logins to five requests per minute for every email and IP
    // address combination.

    'limiters' => [
        'login' => 'login',
        'two-factor' => 'two-factor',
        'passkeys' => 'passkeys',
    ],

    // Register View Routes: Here you may specify if the routes returning views should be disabled as you may not need
    // them when building your own application.

    'views' => false,

    // Passkeys: These settings configure Fortify's passkey (WebAuthn) support.

    'passkeys' => [
        'relying_party_id' => parse_url(config('app.url'), PHP_URL_HOST),
        'allowed_origins' => [config('app.url')],
        'user_handle_secret' => env('PASSKEYS_USER_HANDLE_SECRET', config('app.key')),
        'timeout' => 60000,
    ],

    // Features: Some of the Fortify features are optional.

    'features' => [],

];
