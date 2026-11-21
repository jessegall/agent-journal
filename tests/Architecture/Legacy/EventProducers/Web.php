<?php

declare(strict_types=1);

use App\Web\Events\PageChanged;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Web with their role, owning transition and the files that send them today (doc 70, table 1).
 * Each migration slice sets migrated, names a sample, and leaves its owner the one producer; EventProducerTest fails
 * on any producer not listed here.
 */
return [
    PageChanged::class => [
        'role' => EventRole::Projection,
        'migrated' => false,
        'producers' => [
            'app/Web/Listeners/BroadcastPageChange.php',
        ],
    ],
];
