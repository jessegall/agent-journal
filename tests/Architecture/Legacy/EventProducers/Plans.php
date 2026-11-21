<?php

declare(strict_types=1);

use App\Actors\Support\ActorContext;
use Domain\Plans\Api\Events\PlanCancelled;
use Domain\Plans\Api\Events\PlanFinished;
use Domain\Plans\Api\Events\PlanProgressChanged;
use Domain\Plans\Api\Events\PlanStarted;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Plans with their role, owning transition and the files that send them today (doc 70, table 1).
 * Each migration slice sets migrated, names a sample, and leaves its owner the one producer; EventProducerTest fails
 * on any producer not listed here.
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
    PlanStarted::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Plan::startOnce',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new PlanStarted('plan', ActorContext::forUser('user')),
    ],
];
