<?php

declare(strict_types=1);

use App\Enums\ShareState;
use App\Events\ShareActivated;
use App\Events\ShareCreated;
use App\Events\ShareExpired;
use App\Events\ShareFailed;
use App\Events\ShareGatewayChanged;
use App\Events\ShareGatewayMadeDefault;
use App\Events\SharePruned;
use App\Events\ShareRequested;
use App\Events\ShareRetried;
use App\Events\ShareRevoked;
use App\Events\ShareScopeChanged;
use App\Support\ShareFact;
use Carbon\CarbonImmutable;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Sharing with their role, owning transition or the files that send them.
 * Each row fact names its owning transition and a sample; every other event names the files that send it.
 * EventProducerTest fails on any producer not listed here.
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
    ShareRetried::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Share::retryOpening',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ShareRetried(new ShareFact('share', 'configuration', ShareState::Pending, 1, new CarbonImmutable('2026-01-01'))),
    ],
    SharePruned::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Share::countPruned',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new SharePruned('share', new CarbonImmutable('2026-01-01')),
    ],
    ShareGatewayMadeDefault::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ShareGatewayConfiguration::makeDefault',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ShareGatewayMadeDefault('configuration'),
    ],
];
