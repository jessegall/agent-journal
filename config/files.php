<?php

declare(strict_types=1);

return [
    /*
     * The root folder of each place the file funnel may touch. The accounts and sharing-secrets places keep their one
     * setting where their own areas read it, accounts.root and sharing.secrets_dir; host-skills is filled by the Skills
     * area's provider from SkillTargets::root().
     */
    'places' => [
        'project' => base_path(),
        'sharing-tunnels' => storage_path('sharing'),
        'host-skills' => null,
        'temporary' => sys_get_temp_dir(),
    ],

    // The folders inside a place the funnel never enters, relative to the project root.
    'closed_folders' => ['.journal/worktrees', '.git', 'vendor', 'node_modules', 'storage/app/private'],

    // The most bytes of file contents kept for repeated reads in one process, and the largest file kept.
    'cached_bytes' => 32 * 1024 * 1024,
    'largest_cached_file' => 1024 * 1024,
];
