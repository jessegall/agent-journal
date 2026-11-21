<?php

declare(strict_types=1);

use App\Sharing\Events\ShareActivated;
use App\Sharing\Events\ShareCreated;
use App\Sharing\Events\ShareExpired;
use App\Sharing\Events\ShareFailed;
use App\Sharing\Events\ShareGatewayChanged;
use App\Sharing\Events\ShareRequested;
use App\Sharing\Events\ShareRevoked;
use App\Sharing\Events\ShareScopeChanged;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Sharing with their role, owning transition and the files that send them today (doc 70, table 1).
 * Each migration slice sets migrated, names a sample, and leaves its owner the one producer; EventProducerTest fails
 * on any producer not listed here.
 */
return [
    ShareActivated::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Share::activate',
        'migrated' => false,
        'producers' => [
            'app/Sharing/Handlers/RecordGatewayOutcomeHandler.php',
        ],
    ],
    ShareCreated::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Share::create',
        'migrated' => false,
        'producers' => [
            'app/Sharing/Actions/ShareGrants.php',
        ],
    ],
    ShareExpired::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Share::end',
        'migrated' => false,
        'producers' => [
            'app/Sharing/Actions/ShareEndings.php',
        ],
    ],
    ShareFailed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Share::failActivation',
        'migrated' => false,
        'producers' => [
            'app/Sharing/Handlers/RecordGatewayOutcomeHandler.php',
        ],
    ],
    ShareGatewayChanged::class => [
        'role' => EventRole::RowFact,
        'owner' => 'ShareGatewayConfiguration::configure',
        'migrated' => false,
        'returnedBy' => ['changedEvent'],
        'producers' => [
            'app/Sharing/Handlers/ConfigureShareGatewayHandler.php',
            'app/Sharing/Handlers/DisableShareGatewayHandler.php',
        ],
    ],
    ShareRequested::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Share::create',
        'migrated' => false,
        'producers' => [
            'app/Sharing/Handlers/RequestShareHandler.php',
        ],
    ],
    ShareRevoked::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Share::end',
        'migrated' => false,
        'producers' => [
            'app/Sharing/Actions/ShareEndings.php',
        ],
    ],
    ShareScopeChanged::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Share::advanceScope',
        'migrated' => false,
        'producers' => [
            'app/Sharing/Actions/ShareGrants.php',
        ],
    ],
];
