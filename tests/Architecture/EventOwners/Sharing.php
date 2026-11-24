<?php

declare(strict_types=1);

use App\Enums\GatewayEndpointState;
use App\Enums\GatewayOutcome;
use App\Enums\ShareState;
use App\Events\Sharing\ShareActivated;
use App\Events\Sharing\ShareCreated;
use App\Events\Sharing\ShareExpired;
use App\Events\Sharing\ShareFailed;
use App\Events\Sharing\ShareGatewayChanged;
use App\Events\Sharing\ShareGatewayEndpointFoundHealthy;
use App\Events\Sharing\ShareGatewayEndpointMoved;
use App\Events\Sharing\ShareGatewayMadeDefault;
use App\Events\Sharing\ShareGatewayOperationClaimed;
use App\Events\Sharing\ShareGatewayOperationFinished;
use App\Events\Sharing\ShareInstallationHeld;
use App\Events\Sharing\SharePreviewConsumed;
use App\Events\Sharing\SharePruned;
use App\Events\Sharing\ShareRequested;
use App\Events\Sharing\ShareRetried;
use App\Events\Sharing\ShareRevoked;
use App\Events\Sharing\ShareScopeChanged;
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
    ShareGatewayEndpointMoved::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ShareGatewayEndpoint::moveTo',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ShareGatewayEndpointMoved('endpoint', GatewayEndpointState::cases()[0]),
    ],
    ShareGatewayEndpointFoundHealthy::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ShareGatewayEndpoint::recordHealthy',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ShareGatewayEndpointFoundHealthy('endpoint'),
    ],
    ShareGatewayOperationClaimed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ShareGatewayOperation::claimFor',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ShareGatewayOperationClaimed('operation', 'run'),
    ],
    ShareGatewayOperationFinished::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ShareGatewayOperation::finish',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ShareGatewayOperationFinished('operation', GatewayOutcome::cases()[0]),
    ],
    ShareInstallationHeld::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ShareInstallation::holdFor',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new ShareInstallationHeld('installation', 'run'),
    ],
    SharePreviewConsumed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'SharePreview::consumeFor',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new SharePreviewConsumed('preview'),
    ],
];
