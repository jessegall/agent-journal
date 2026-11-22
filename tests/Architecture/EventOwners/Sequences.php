<?php

declare(strict_types=1);

use App\Enums\ActorType;
use App\Support\ActorIdentity;
use App\Values\StackTarget;
use Domain\Sequences\Enums\SequenceRunState;
use Domain\Sequences\Events\SequenceEnded;
use Domain\Sequences\Events\SequenceStarted;
use Domain\Sequences\Events\SequenceStepEnded;
use Domain\Sequences\Events\SequenceStepReached;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Sequences with their role, owning transition or the files that send them.
 * Each row fact names its owning transition and a sample; every other event names the files that send it.
 * EventProducerTest fails on any producer not listed here.
 */
return [
    SequenceStarted::class => [
        'role' => EventRole::RowFact,
        'owner' => 'SequenceRun::startFor',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new SequenceStarted('run', new StackTarget('agent', 'session')),
    ],
    SequenceStepReached::class => [
        'role' => EventRole::RowFact,
        'owner' => ['SequenceRun::startFor', 'SequenceRun::advance'],
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new SequenceStepReached('run', new ActorIdentity(ActorType::Agent, 'agent'), 1),
    ],
    SequenceStepEnded::class => [
        'role' => EventRole::RowFact,
        'owner' => 'SequenceRun::advance',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new SequenceStepEnded('run', new ActorIdentity(ActorType::Agent, 'agent'), 1),
    ],
    SequenceEnded::class => [
        'role' => EventRole::RowFact,
        'owner' => ['SequenceRun::advance', 'SequenceRun::cancel'],
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new SequenceEnded('run', new ActorIdentity(ActorType::Agent, 'agent'), SequenceRunState::Finished),
    ],
];
