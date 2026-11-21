<?php

declare(strict_types=1);

use Domain\Chat\Events\DockChanged;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Chat with their role, owning transition or the files that send them.
 * Each row fact names its owning transition and a sample; every other event names the files that send it.
 * EventProducerTest fails on any producer not listed here.
 */
return [
    DockChanged::class => [
        'role' => EventRole::RowFact,
        'owner' => ['DockPlacement::create', 'DockPlacement::remove'],
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new DockChanged('conversation'),
    ],
];
