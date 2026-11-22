<?php

declare(strict_types=1);

use App\Actors\Support\ActorContext;
use Domain\Plans\Api\Events\PlanCancelled;
use Domain\Plans\Api\Events\PlanFinished;
use Domain\Plans\Api\Events\PlanProgressChanged;
use Domain\Plans\Api\Events\PlanReviewDecided;
use Domain\Plans\Api\Events\PlanReviewRequested;
use Domain\Plans\Enums\PlanReviewState;
use Domain\Plans\Api\Events\PlanReviewWithdrawn;
use Domain\Plans\Api\Events\PlanStarted;
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
        'role' => EventRole::Projection,
        'migrated' => false,
        'producers' => [
            'domain/Plans/src/Listeners/RaisePlanProgressChanged.php',
            'domain/Plans/src/Listeners/SamplePlanOfStartedTask.php',
        ],
    ],
    PlanReviewDecided::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Plan::settleReview',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new PlanReviewDecided('plan', 'edition', PlanReviewState::Approved),
    ],
    PlanReviewRequested::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Plan::requestReview',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new PlanReviewRequested('plan', 'edition'),
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
];
