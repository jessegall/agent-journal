<?php

declare(strict_types=1);

return [

    /*
    |--------------------------------------------------------------------------
    | Local Sign in
    |--------------------------------------------------------------------------
    |
    | The sign-in form's starting values in local development only, so opening
    | the journal in Docker needs only Enter. Leave both empty outside local
    | development; they are never used in any other environment.
    |
    */

    'local_sign_in' => [
        'email' => env('LOCAL_SIGN_IN_EMAIL', ''),
        'password' => env('LOCAL_SIGN_IN_PASSWORD', ''),
    ],

];
