<?php

declare(strict_types=1);

return [
    /*
     * The root folder of each place the file funnel may touch. The private places of accounts and sharing keep their one
     * setting where their own areas read it (accounts.root, sharing.secrets_dir, sharing.tunnels_dir), as process-output
     * keeps its disk's root; host-skills is filled by the Skills area's provider from SkillTargets::root().
     */
    'places' => [
        'project' => base_path(),
        'host-skills' => null,
        'temporary' => sys_get_temp_dir(),
        // The agent host's runtime folder of one start, set by the hook relay from the folder of its bypass log.
        'hook-runtime' => null,
    ],

    // The most bytes of file contents kept for repeated reads in one process, and the largest file kept.
    'cached_bytes' => 32 * 1024 * 1024,
    'largest_cached_file' => 1024 * 1024,
];
