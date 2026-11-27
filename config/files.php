<?php

declare(strict_types=1);

return [
    /*
    |--------------------------------------------------------------------------
    | Places
    |--------------------------------------------------------------------------
    |
    | The root folder of each place the file funnel may touch. The private
    | places of accounts and sharing keep their one setting where their own
    | areas read it (accounts.root, sharing.secrets_dir, sharing.tunnels_dir),
    | as process-output keeps its disk's root.
    |
    */

    'places' => [
        'project' => base_path(),
        'temporary' => sys_get_temp_dir(),
        /*
        |--------------------------------------------------------------------------
        | Hook Runtime
        |--------------------------------------------------------------------------
        |
        | The agent host's runtime folder of one start, set by the hook relay
        | from the folder of its bypass log.
        |
        */

        'hook-runtime' => null,
        /*
        |--------------------------------------------------------------------------
        | Releases
        |--------------------------------------------------------------------------
        |
        | The published journal-agent releases, one folder per version as
        | journal-release writes it.
        |
        */

        'releases' => env('JOURNAL_RELEASES_FOLDER', storage_path('app/releases')),
    ],

    /*
    |--------------------------------------------------------------------------
    | Cached Bytes
    |--------------------------------------------------------------------------
    |
    | The most bytes of file contents kept for repeated reads in one process,
    | and the largest file kept.
    |
    */

    'cached_bytes' => 32 * 1024 * 1024,
    'largest_cached_file' => 1024 * 1024,
];
