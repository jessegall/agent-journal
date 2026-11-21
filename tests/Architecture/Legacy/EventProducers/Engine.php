<?php

declare(strict_types=1);

use App\Engine\Events\EngineTicked;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Engine with their role, owning transition and the files that send them today (doc 70, table 1).
 * Each migration slice sets migrated, names a sample, and leaves its owner the one producer; EventProducerTest fails
 * on any producer not listed here.
 */
return [
    EngineTicked::class => [
        'role' => EventRole::Infrastructure,
        'migrated' => false,
        'producers' => [
            'app/Engine/Support/EngineTickedDelivery.php',
        ],
    ],
];
