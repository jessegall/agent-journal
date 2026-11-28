<?php

declare(strict_types=1);

use App\Events\Web\InboxAccessEnded;
use App\Events\Web\LayoutRemoved;
use App\Events\Web\LayoutSaved;
use App\Events\Web\NotificationsInvalidated;
use App\Events\Web\PageChanged;
use App\Events\Web\ProtectedViewInvalidated;
use App\Events\Web\RunningCommandChanged;
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
        ],
    ],
    InboxAccessEnded::class => [
        'role' => EventRole::Projection,
        'migrated' => false,
        'producers' => [
            'app/Listeners/NotifyInboxAccessEnded.php',
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
            'app/Support/ProtectedViews.php',
        ],
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
    RunningCommandChanged::class => [
        'role' => EventRole::Projection,
        'migrated' => false,
        'producers' => [
            'app/Listeners/BroadcastRunningCommand.php',
        ],
    ],
];
