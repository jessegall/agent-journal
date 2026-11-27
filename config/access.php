<?php

declare(strict_types=1);

return [

    /*
    |--------------------------------------------------------------------------
    | Owner Email
    |--------------------------------------------------------------------------
    |
    | The email address of the one user (users table) who may use the journal.
    | Unset means nobody may; the first account or a registration grants
    | nothing. Locally, `php artisan db:seed` creates owner@journal.local.
    |
    */

    'owner_email' => env('JOURNAL_OWNER_EMAIL'),

    /*
    |--------------------------------------------------------------------------
    | Owner Password
    |--------------------------------------------------------------------------
    |
    | The owner account's password on a server: access:owner-ensure makes the
    | owner with it on every install, so the login stays the same across
    | resets. Unset makes no account.
    |
    */

    'owner_password' => env('JOURNAL_OWNER_PASSWORD'),

];
