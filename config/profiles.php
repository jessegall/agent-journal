<?php

declare(strict_types=1);

return [

    /*
    | A proposal of the project's profiles, in the shape doc 14 section 63 describes. It is not live authority: an
    | owner activates it with php artisan profile:activate, which validates it whole and appends one revision per
    | profile.
    */
    'revision' => 1,

    'base_overrides' => [],

    'profiles' => [
        'journal-main' => [
            'base' => 'main-agent',
            'model' => 'opus',
            'supervisor' => ['default' => 'owner'],
        ],
        'journal-worker' => [
            'base' => 'writing-helper',
            'model' => 'sonnet',
            'supervisor' => ['default' => 'profile:journal-code-reviewer'],
        ],
        'journal-code-reviewer' => [
            'base' => 'read-only-helper',
            'model' => 'sonnet',
            'supervisor' => ['default' => 'profile:journal-main', 'merge.ready' => 'profile:journal-merger'],
        ],
        'journal-merger' => [
            'base' => 'writing-helper',
            'model' => 'sonnet',
            'supervisor' => ['default' => 'profile:journal-main'],
        ],
    ],

];
