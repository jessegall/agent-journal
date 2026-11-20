<?php

declare(strict_types=1);

return [
    // How long a sign-in may wait for its user; polling never prolongs it.
    'sign_in_minutes' => (int) env('ACCOUNTS_SIGN_IN_MINUTES', 15),

    // The journal-owned folder on the host that holds each account's private program folder.
    // The Claude Code program the host's sign-in runner starts, as installed on the host.
    'claude_program' => env('ACCOUNTS_CLAUDE_PROGRAM', 'claude'),

    // The Codex program the host's sign-in runner starts, as installed on the host.
    'codex_program' => env('ACCOUNTS_CODEX_PROGRAM', 'codex'),

    'root' => env('ACCOUNTS_ROOT', storage_path('app/private/accounts')),

    /*
    | The allow-list proxy every sign-in program goes out through on a server (doc 61, decision 5); empty on the Mac.
    */
    'egress_proxy' => (string) env('JOURNAL_EGRESS_PROXY', ''),
];
