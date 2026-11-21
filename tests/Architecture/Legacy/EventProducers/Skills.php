<?php

declare(strict_types=1);

use App\Skills\Events\SessionSkillsIntended;
use App\Skills\Events\SkillsChanged;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Skills with their role, owning transition and the files that send them today (doc 70, table 1).
 * Each migration slice sets migrated, names a sample, and leaves its owner the one producer; EventProducerTest fails
 * on any producer not listed here.
 */
return [
    SessionSkillsIntended::class => [
        'role' => EventRole::RowFact,
        'owner' => 'SkillPublication::intendMany',
        'migrated' => false,
        'producers' => [
            'app/Skills/Listeners/AdmitStartSkills.php',
            'app/Skills/Listeners/RefreshSessionSkills.php',
        ],
    ],
    SkillsChanged::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Skill::appendRevision',
        'migrated' => false,
        'producers' => [
            'app/Skills/Support/StoredSkillWrites.php',
        ],
    ],
];
