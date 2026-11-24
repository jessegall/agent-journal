<?php

declare(strict_types=1);

use App\Events\ChatAccessEnded;
use App\Events\DeskPreferenceSwitched;
use App\Events\DeskRenamed;
use App\Events\DeskSeatingAdvanced;
use App\Events\LayoutRemoved;
use App\Events\LayoutSaved;
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
            'app/Listeners/NotifyReceiptsWithdrawn.php',
        ],
    ],
    DeskPreferenceSwitched::class => [
        'role' => EventRole::RowFact,
        'owner' => 'DeskPreference::switchTo',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DeskPreferenceSwitched('preference'),
    ],
    DeskSeatingAdvanced::class => [
        'role' => EventRole::RowFact,
        'owner' => 'DeskRecord::advanceSeating',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DeskSeatingAdvanced('desk'),
    ],
    DeskRenamed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'DeskRecord::rename',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DeskRenamed('desk', 'Desk'),
    ],
    LayoutSaved::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Layout::saveNameAndShape',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new LayoutSaved('layout'),
    ],
    LayoutRemoved::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Layout::remove',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new LayoutRemoved('layout'),
    ],
];
