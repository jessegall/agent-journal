<?php

declare(strict_types=1);

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
        'migrated' => false,
        'producers' => [
            'domain/Plans/src/Handlers/CancelPlanHandler.php',
        ],
    ],
    PlanFinished::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Plan::finish',
        'migrated' => false,
        'producers' => [
            'domain/Plans/src/Handlers/FinishPlanHandler.php',
        ],
    ],
    PlanProgressChanged::class => [
        'role' => EventRole::Projection,
        'migrated' => false,
        'producers' => [
            'domain/Plans/src/Listeners/RaisePlanProgressChanged.php',
        ],
    ],
    PlanStarted::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Plan::startOnce',
        'migrated' => false,
        'producers' => [
            'domain/Plans/src/Handlers/StartPlanHandler.php',
        ],
    ],
];
