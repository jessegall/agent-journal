<?php

declare(strict_types=1);

use App\Enums\PublicationState;
use App\Events\SessionSkillsIntended;
use App\Events\SkillPublicationMoved;
use App\Events\SkillsChanged;
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
        'sample' => fn () => new SkillPublicationMoved('publication', 'session', PublicationState::Delivered),
    ],
    SkillsChanged::class => [
        'role' => EventRole::RowFact,
        'owner' => ['Skill::makeCurrent', 'Skill::retireBy'],
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new SkillsChanged('skill', 2),
    ],
];
