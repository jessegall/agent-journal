<?php

declare(strict_types=1);

return [

    /*
     * Whether this host may run admitted command lines under the supervisor. Off until a host is set up for it; while
     * off, every start refuses with runner-unavailable and nothing spawns.
     */
    'runner' => (bool) env('JOURNAL_PROCESS_RUNNER', false),

    'minimum_free_bytes' => (int) env('JOURNAL_PROCESS_MINIMUM_FREE_BYTES', 104_857_600),

    /*
     * The key and label projects:local-provision gives the installation's own project when it makes it; the project
     * row, not this setting, owns what is stored under it.
     */
    'project_key' => (string) env('JOURNAL_PROJECT_KEY', env('APP_NAME', 'journal')),

    'project_label' => (string) env('JOURNAL_PROJECT_LABEL', env('APP_NAME', 'Journal')),

    /*
     * Whether this installation runs agents itself, so it needs a local project, its Main environment and the owner's
     * grants on it; off, projects:local-provision makes nothing and the installation still opens.
     */
    'local_execution' => (bool) env('JOURNAL_LOCAL_EXECUTION', true),

];
