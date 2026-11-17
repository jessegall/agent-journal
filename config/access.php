<?php

declare(strict_types=1);

return [

    /*
    | The id of the one user (users table) who may use the journal. Unset means nobody may; the first account or a
    | registration grants nothing. Locally, `php artisan db:seed` creates owner@journal.local, usually with id 1.
    */

    'owner_id' => env('JOURNAL_OWNER_ID'),

];
