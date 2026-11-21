<?php

declare(strict_types=1);

use App\Sharing\Enums\ShareState;
use App\Sharing\Events\ShareActivated;
use App\Sharing\Events\ShareCreated;
use App\Sharing\Events\ShareExpired;
use App\Sharing\Events\ShareFailed;
use App\Sharing\Events\ShareGatewayChanged;
use App\Sharing\Events\ShareRequested;
use App\Sharing\Events\ShareRevoked;
use App\Sharing\Events\ShareScopeChanged;
use App\Sharing\Support\ShareFact;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Sharing with their role, owning transition and the files that send them today (doc 70, table 1).
 * Each migration slice sets migrated, names a sample, and leaves its owner the one producer; EventProducerTest fails
 * on any producer not listed here.
 */
return [
    ShareActivated::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Share::activate',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ShareActivated(new ShareFact('share', null, ShareState::Active, 1, new DateTimeImmutable('2026-01-01'))),
    ],
    ShareCreated::class => [
        'role' => EventRole::RowFact,
        'owner' => ['Share::create', 'Share::approveAs'],
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ShareCreated(new ShareFact('share', null, ShareState::Pending, 1, new DateTimeImmutable('2026-01-01'))),
    ],
    ShareExpired::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Share::end',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ShareExpired(new ShareFact('share', null, ShareState::Expired, 1, new DateTimeImmutable('2026-01-01'))),
    ],
    ShareFailed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Share::failActivation',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ShareFailed(new ShareFact('share', null, ShareState::Failed, 1, new DateTimeImmutable('2026-01-01'))),
    ],
    ShareGatewayChanged::class => [
        'role' => EventRole::RowFact,
        'owner' => ['ShareGatewayConfiguration::create', 'ShareGatewayConfiguration::disable'],
        'migrated' => true,
        'returnedBy' => ['changedEvent'],
        'producers' => [],
        'sample' => fn () => new ShareGatewayChanged('configuration', 1, false, new DateTimeImmutable('2026-01-01')),
    ],
    ShareRequested::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Share::create',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ShareRequested(new ShareFact('share', null, ShareState::Proposed, 1, new DateTimeImmutable('2026-01-01'))),
    ],
    ShareRevoked::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Share::end',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ShareRevoked(new ShareFact('share', null, ShareState::Revoked, 1, new DateTimeImmutable('2026-01-01'))),
    ],
    ShareScopeChanged::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Share::advanceScope',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ShareScopeChanged(new ShareFact('share', null, ShareState::Active, 1, new DateTimeImmutable('2026-01-01'))),
    ],
];
