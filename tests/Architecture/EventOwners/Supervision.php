<?php

declare(strict_types=1);

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Supervision\Events\AskClosed;
use App\Supervision\Events\AskHopAssigned;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Supervision with their role, owning transition or the files that send them.
 * Each row fact names its owning transition and a sample; every other event names the files that send it.
 * EventProducerTest fails on any producer not listed here.
 */
return [
    AskHopAssigned::class => [
        'role' => EventRole::RowFact,
        'owner' => 'AskHop::create',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AskHopAssigned('ask', 'hop', 'merge.ready', new ActorIdentity(ActorType::Agent, 'agent')),
    ],
    AskClosed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Ask::close',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AskClosed('ask', 'merge.ready'),
    ],
];
