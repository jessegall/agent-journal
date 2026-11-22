<?php

declare(strict_types=1);

use App\Events\EngineTicked;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Engine with their role, owning transition or the files that send them.
 * Each row fact names its owning transition and a sample; every other event names the files that send it.
 * EventProducerTest fails on any producer not listed here.
 */
return [
    EngineTicked::class => [
        'role' => EventRole::Infrastructure,
        'migrated' => false,
        'producers' => [
            'app/Support/EngineTickedDelivery.php',
        ],
    ],
];
