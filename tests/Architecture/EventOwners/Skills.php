<?php

declare(strict_types=1);

use App\Events\Skills\SkillContextEpochAdvanced;
use App\Events\Skills\SkillGenerationRetired;
use App\Events\Skills\SkillsChanged;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Skills with their role, owning transition or the files that send them.
 * Each row fact names its owning transition and a sample; every other event names the files that send it.
 * EventProducerTest fails on any producer not listed here.
 */
return [
    SkillsChanged::class => [
        'role' => EventRole::RowFact,
        'owner' => ['Skill::makeCurrent', 'Skill::retireBy'],
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new SkillsChanged('skill', 2),
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
