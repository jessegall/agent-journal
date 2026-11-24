<?php

declare(strict_types=1);

use Domain\Memory\Events\MemoryRevised;
use Domain\Memory\Events\MemorySaved;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Memory with their role, owning transition or the files that send them.
 * Each row fact names its owning transition and a sample; every other event names the files that send it.
 * EventProducerTest fails on any producer not listed here.
 */
return [
    MemorySaved::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Memory::saveFor',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new MemorySaved('memory'),
    ],
    MemoryRevised::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Memory::revise',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new MemoryRevised('memory'),
    ],
];
