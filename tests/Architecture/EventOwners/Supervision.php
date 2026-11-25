<?php

declare(strict_types=1);

use App\Events\Asks\AskAccepted;
use App\Events\Asks\AskAnsweredLate;
use App\Events\Asks\AskClosed;
use App\Events\Asks\AskEscalated;
use App\Events\Asks\AskHopAnswered;
use App\Events\Asks\AskHopAssigned;
use App\Events\Asks\AskHopAttentionRecorded;
use App\Events\Asks\AskHopWakeRecorded;
use App\Events\SupervisorLinks\SupervisorLinkChanged;
use App\Models\Agents\Agent;
use App\Support\ActorReference;
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
        'sample' => fn () => new AskHopAssigned('ask', 'hop', 'merge.ready', ActorReference::ofClass(Agent::class, 'agent')),
    ],
    AskClosed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Ask::close',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AskClosed('ask', 'merge.ready'),
    ],
    AskAccepted::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Ask::accept',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AskAccepted('ask'),
    ],
    AskEscalated::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Ask::escalateTo',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AskEscalated('ask', 'main'),
    ],
    AskAnsweredLate::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Ask::answerLate',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AskAnsweredLate('ask'),
    ],
    AskHopAnswered::class => [
        'role' => EventRole::RowFact,
        'owner' => 'AskHop::answer',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AskHopAnswered('ask', 'hop'),
    ],
    AskHopWakeRecorded::class => [
        'role' => EventRole::RowFact,
        'owner' => 'AskHop::recordWake',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AskHopWakeRecorded('ask', 'hop', 'woken'),
    ],
    AskHopAttentionRecorded::class => [
        'role' => EventRole::RowFact,
        'owner' => 'AskHop::recordAttention',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AskHopAttentionRecorded('ask', 'hop', 'told'),
    ],
    SupervisorLinkChanged::class => [
        'role' => EventRole::RowFact,
        'owner' => 'SupervisorLink::change',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new SupervisorLinkChanged('link'),
    ],
];
