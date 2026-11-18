<?php

declare(strict_types=1);

return [

    /*
    | The email address of the one user (users table) who may use the journal. Unset means nobody may; the first account
    | or a registration grants nothing. Locally, `php artisan db:seed` creates owner@journal.local.
    */

    'owner_email' => env('JOURNAL_OWNER_EMAIL'),

];
