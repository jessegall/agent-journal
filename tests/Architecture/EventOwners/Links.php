<?php

declare(strict_types=1);

use App\Events\Links\LinkRemoved;
use App\Events\Links\LinksRemoved;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Links with their role, owning transition or the files that send them.
 * Each row fact names its owning transition and a sample; every other event names the files that send it.
 * EventProducerTest fails on any producer not listed here.
 */
return [
    LinksRemoved::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Support/LinkRemoval.php',
        ],
    ],
    LinkRemoved::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Link::remove',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new LinkRemoved('link'),
    ],
];
