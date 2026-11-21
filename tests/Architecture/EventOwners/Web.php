<?php

declare(strict_types=1);

use App\Web\Events\PageChanged;
use App\Web\Events\ProtectedViewInvalidated;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Web with their role, owning transition or the files that send them.
 * Each row fact names its owning transition and a sample; every other event names the files that send it.
 * EventProducerTest fails on any producer not listed here.
 */
return [
    PageChanged::class => [
        'role' => EventRole::Projection,
        'migrated' => false,
        'producers' => [
            'app/Web/Listeners/BroadcastPageChange.php',
            'app/Web/Listeners/BroadcastDockedSourceChange.php',
        ],
    ],
    ProtectedViewInvalidated::class => [
        'role' => EventRole::Projection,
        'migrated' => false,
        'producers' => [
            'app/Web/Listeners/BroadcastProtectedViewInvalidation.php',
        ],
    ],
];
