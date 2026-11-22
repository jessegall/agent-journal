<?php

declare(strict_types=1);

use App\Events\ChatAccessEnded;
use App\Events\NotificationsInvalidated;
use App\Events\PageChanged;
use App\Events\ProtectedViewInvalidated;
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
            'app/Listeners/BroadcastPageChange.php',
            'app/Listeners/BroadcastDockedSourceChange.php',
        ],
    ],
    ChatAccessEnded::class => [
        'role' => EventRole::Projection,
        'migrated' => false,
        'producers' => [
            'app/Listeners/BroadcastPageChange.php',
        ],
    ],
    NotificationsInvalidated::class => [
        'role' => EventRole::Projection,
        'migrated' => false,
        'producers' => [
            'app/Listeners/BroadcastNotificationChanges.php',
        ],
    ],
    ProtectedViewInvalidated::class => [
        'role' => EventRole::Projection,
        'migrated' => false,
        'producers' => [
            'app/Listeners/BroadcastProtectedViewInvalidation.php',
            'app/Listeners/PurgeWithdrawnNotifications.php',
        ],
    ],
];
