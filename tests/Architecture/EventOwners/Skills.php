<?php

declare(strict_types=1);

use App\Events\Skills\SkillGenerationRetired;
use App\Events\Skills\SkillRead;
use App\Events\Skills\SkillReadAsked;
use App\Events\Skills\SkillReadForgotten;
use App\Events\Skills\SkillsChanged;
use App\Skills\Enums\ReadEvidence;
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
    SkillRead::class => [
        'role' => EventRole::RowFact,
        'owner' => 'SkillReadEntry::record',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new SkillRead('session', 'journal', ReadEvidence::SkillShow),
    ],
    SkillReadForgotten::class => [
        'role' => EventRole::RowFact,
        'owner' => 'SkillReadEntry::forget',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new SkillReadForgotten('session', 'journal'),
    ],
    SkillReadAsked::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Skills/SkillReadAsks.php',
        ],
    ],
    SkillGenerationRetired::class => [
        'role' => EventRole::RowFact,
        'owner' => 'SkillGeneration::retire',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new SkillGenerationRetired('generation'),
    ],
];
