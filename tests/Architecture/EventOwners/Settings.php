<?php

declare(strict_types=1);

use App\Events\Settings\SettingsChanged;
use App\Events\Settings\SettingsRevised;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Settings with their role, owning transition or the files that send them.
 * Each row fact names its owning transition and a sample; every other event names the files that send it.
 * EventProducerTest fails on any producer not listed here.
 */
return [
    SettingsChanged::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Settings/SettingsWriter.php',
        ],
    ],
    SettingsRevised::class => [
        'role' => EventRole::RowFact,
        'owner' => 'SettingsRecord::revise',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new SettingsRevised('settings'),
    ],
];
