<?php

declare(strict_types=1);

return [

    /*
    |--------------------------------------------------------------------------
    | Revision
    |--------------------------------------------------------------------------
    |
    | A proposal of the project's profiles, in the shape doc 14 section 63
    | describes. It is not live authority: an owner activates it with php
    | artisan profile:activate, which validates it whole and appends one
    | revision per profile. A profile's tier (1 simplest, 2 general, 3
    | complex, 4 exceptional) names its default model in each driver family,
    | and preferred_driver the driver a start preselects; every driver and
    | model can still be chosen.
    |
    */

    'revision' => 1,

    'base_overrides' => [],

    'profiles' => [
        'journal-main' => [
            'description' => 'The main agent that works the project\'s plans and talks with you.',
            'base' => 'main-agent',
            'tier' => 3,
            'supervisor' => ['default' => 'owner'],
        ],
        'journal-worker' => [
            'description' => 'Writes one assigned task or plan in a worktree of its own.',
            'base' => 'writing-helper',
            'tier' => 2,
            'supervisor' => ['default' => 'profile:journal-code-reviewer'],
            'instances' => 'per_job',
        ],
        'journal-code-reviewer' => [
            'description' => 'Reviews a worker\'s changes before they are merged.',
            'base' => 'read-only-helper',
            'tier' => 2,
            'supervisor' => ['default' => 'profile:journal-main'],
            'instances' => 'single',
        ],
        'journal-merger' => [
            'description' => 'Checks a finished worker\'s proofs and merges its work.',
            'base' => 'writing-helper',
            'tier' => 2,
            'supervisor' => ['default' => 'profile:journal-main'],
            'instances' => 'single',
        ],
    ],

];
