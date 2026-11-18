<?php

declare(strict_types=1);

return [

    /*
     * Whether this host may run admitted command lines under the supervisor. Off until a host is set up for it; while
     * off, every start refuses with runner-unavailable and nothing spawns.
     */
    'runner' => (bool) env('JOURNAL_PROCESS_RUNNER', false),

    /*
     * The key of this installation's project (plan 14, decision D3): every rule, proposal, request, permit and proof
     * is stored under it and read only by it, so a second project never sees another's rows.
     */
    'minimum_free_bytes' => (int) env('JOURNAL_PROCESS_MINIMUM_FREE_BYTES', 104_857_600),

    'project_key' => (string) env('JOURNAL_PROJECT_KEY', env('APP_NAME', 'journal')),

];
