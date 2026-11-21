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
        'role' => EventRole::RowFact,
        'owner' => 'Link::removeAll',
        'migrated' => false,
        'producers' => [
            'app/Links/Models/Link.php',
        ],
    ],
];
