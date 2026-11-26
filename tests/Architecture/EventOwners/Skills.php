<?php

declare(strict_types=1);

use App\Events\Skills\SessionSkillsIntended;
use App\Events\Skills\SkillContextEpochAdvanced;
use App\Events\Skills\SkillGenerationRetired;
use App\Events\Skills\SkillPublicationClaimed;
use App\Events\Skills\SkillPublicationMoved;
use App\Events\Skills\SkillPublicationProgressed;
use App\Events\Skills\SkillsChanged;
use App\Skills\Enums\PublicationStatus;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Skills with their role, owning transition or the files that send them.
 * Each row fact names its owning transition and a sample; every other event names the files that send it.
 * EventProducerTest fails on any producer not listed here.
 */
return [
    SessionSkillsIntended::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Listeners/AdmitStartSkills.php',
            'app/Listeners/RefreshSessionSkills.php',
        ],
    ],
    SkillPublicationMoved::class => [
        'role' => EventRole::RowFact,
        'owner' => 'SkillPublication::raiseMoved',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new SkillPublicationMoved('publication', 'session', PublicationStatus::Delivered),
    ],
    SkillsChanged::class => [
        'role' => EventRole::RowFact,
        'owner' => ['Skill::makeCurrent', 'Skill::retireBy'],
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new SkillsChanged('skill', 2),
    ],
    SkillPublicationClaimed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'SkillPublication::claim',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new SkillPublicationClaimed('publication', 1),
    ],
    SkillPublicationProgressed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'SkillPublication::recordProgress',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new SkillPublicationProgressed('publication', 3),
    ],
    SkillGenerationRetired::class => [
        'role' => EventRole::RowFact,
        'owner' => 'SkillGeneration::retire',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new SkillGenerationRetired('generation'),
    ],
    SkillContextEpochAdvanced::class => [
        'role' => EventRole::RowFact,
        'owner' => 'SkillContextEpoch::advance',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new SkillContextEpochAdvanced('epoch'),
    ],
];
