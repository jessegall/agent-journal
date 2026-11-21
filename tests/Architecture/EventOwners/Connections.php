<?php

declare(strict_types=1);

use App\Connections\Enums\BindingReadiness;
use App\Connections\Events\ProjectBindingCreated;
use App\Connections\Events\ProjectBindingReadinessChanged;
use App\Connections\Events\ProjectBindingRevoked;
use App\Connections\Events\ProjectCreated;
use App\Connections\Events\ProjectInvitationIssued;
use App\Connections\Events\ProjectInvitationRevoked;
use App\Connections\Events\ProjectInvitationSpent;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Connections with their role, owning transition or the files that send them.
 * Each row fact names its owning transition and a sample; every other event names the files that send it.
 * EventProducerTest fails on any producer not listed here.
 */
return [
    ProjectBindingReadinessChanged::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ProjectBinding::recordPresence',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ProjectBindingReadinessChanged('binding', BindingReadiness::Ready, new DateTimeImmutable('2026-01-01')),
    ],
    ProjectCreated::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Project::create',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ProjectCreated('project', new DateTimeImmutable('2026-01-01')),
    ],
    ProjectInvitationIssued::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ProjectInvitation::issue',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ProjectInvitationIssued('invitation', new DateTimeImmutable('2026-01-01'), new DateTimeImmutable('2026-01-01')),
    ],
    ProjectInvitationRevoked::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ProjectInvitation::revoke',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ProjectInvitationRevoked('invitation', new DateTimeImmutable('2026-01-01')),
    ],
    ProjectInvitationSpent::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ProjectInvitation::spendOn',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ProjectInvitationSpent('invitation', 'binding', new DateTimeImmutable('2026-01-01')),
    ],
    ProjectBindingCreated::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ProjectBinding::create',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ProjectBindingCreated('binding', 'project', 'host', new DateTimeImmutable('2026-01-01')),
    ],
    ProjectBindingRevoked::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ProjectBinding::revoke',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ProjectBindingRevoked('binding', 2, new DateTimeImmutable('2026-01-01')),
    ],
];
