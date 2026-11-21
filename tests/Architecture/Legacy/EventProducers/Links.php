<?php

declare(strict_types=1);

use App\Links\Events\LinksRemoved;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Links with their role, owning transition and the files that send them today (doc 70, table 1).
 * Each migration slice sets migrated, names a sample, and leaves its owner the one producer; EventProducerTest fails
 * on any producer not listed here.
 */
return [
    LinksRemoved::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Records/Support/LinkRemoval.php',
        ],
    ],
];
