<?php

declare(strict_types=1);

use App\Settings\Events\SettingsChanged;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Settings with their role, owning transition and the files that send them today (doc 70, table 1).
 * Each migration slice sets migrated, names a sample, and leaves its owner the one producer; EventProducerTest fails
 * on any producer not listed here.
 */
return [
    SettingsChanged::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Settings/Support/SettingsWriter.php',
        ],
    ],
];
