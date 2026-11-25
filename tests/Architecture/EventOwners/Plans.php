<?php

declare(strict_types=1);

use App\Support\ActorContext;
use App\Support\ActorIdentity;
use Domain\Plans\Enums\PlanReviewStatus;
use Domain\Plans\Events\PhaseProgressRecorded;
use Domain\Plans\Events\PhaseRevisionAdvanced;
use Domain\Plans\Events\PlanCancelled;
use Domain\Plans\Events\PlanDescribed;
use Domain\Plans\Events\PlanFinished;
use Domain\Plans\Events\PlanProgressChanged;
use Domain\Plans\Events\PlanReviewDecided;
use Domain\Plans\Events\PlanReviewEditionApproved;
use Domain\Plans\Events\PlanReviewEditionChangesRequested;
use Domain\Plans\Events\PlanReviewEditionOutdated;
use Domain\Plans\Events\PlanReviewEditionWithdrawn;
use Domain\Plans\Events\PlanReviewRequested;
use Domain\Plans\Events\PlanReviewWithdrawn;
use Domain\Plans\Events\PlanStarted;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Plans with their role, owning transition or the files that send them.
 * Each row fact names its owning transition and a sample; every other event names the files that send it.
 * EventProducerTest fails on any producer not listed here.
 */
return [
    PlanCancelled::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Plan::cancel',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new PlanCancelled('plan', ActorContext::forUser('user')),
    ],
    PlanFinished::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Plan::finish',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new PlanFinished('plan', ActorContext::forUser('user')),
    ],
    PlanProgressChanged::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Plan::recordProgress',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new PlanProgressChanged('plan', 1, 0, 2, 1),
    ],
    PlanReviewDecided::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Plan::settleReview',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new PlanReviewDecided('plan', 'edition', PlanReviewStatus::Approved),
    ],
    PlanReviewRequested::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Plan::requestReview',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new PlanReviewRequested('plan', 'edition', [ActorIdentity::system()], 7),
    ],
    PlanReviewWithdrawn::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Plan::withdrawReview',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new PlanReviewWithdrawn('plan', 'edition'),
    ],
    PlanStarted::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Plan::startOnce',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new PlanStarted('plan', ActorContext::forUser('user')),
    ],
    PlanDescribed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Plan::describe',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new PlanDescribed('plan', 1),
    ],
    PhaseRevisionAdvanced::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Phase::advanceRevision',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new PhaseRevisionAdvanced('phase'),
    ],
    PhaseProgressRecorded::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Phase::recordProgress',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new PhaseProgressRecorded('phase'),
    ],
    PlanReviewEditionWithdrawn::class => [
        'role' => EventRole::RowFact,
        'owner' => 'PlanReviewEdition::withdraw',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new PlanReviewEditionWithdrawn('edition'),
    ],
    PlanReviewEditionApproved::class => [
        'role' => EventRole::RowFact,
        'owner' => 'PlanReviewEdition::approve',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new PlanReviewEditionApproved('edition'),
    ],
    PlanReviewEditionChangesRequested::class => [
        'role' => EventRole::RowFact,
        'owner' => 'PlanReviewEdition::requestChanges',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new PlanReviewEditionChangesRequested('edition'),
    ],
    PlanReviewEditionOutdated::class => [
        'role' => EventRole::RowFact,
        'owner' => 'PlanReviewEdition::markHistorical',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new PlanReviewEditionOutdated('edition'),
    ],
];
