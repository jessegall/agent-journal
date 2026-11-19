<?php

declare(strict_types=1);

return [
    // How long a sign-in may wait for its person; polling never prolongs it.
    'sign_in_minutes' => (int) env('ACCOUNTS_SIGN_IN_MINUTES', 15),

    // The journal-owned folder on the host that holds each account's private program folder.
    'root' => env('ACCOUNTS_ROOT', storage_path('app/private/accounts')),
];
