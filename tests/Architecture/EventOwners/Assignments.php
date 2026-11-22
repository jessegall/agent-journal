<?php

declare(strict_types=1);

use App\Events\AssignmentsChanged;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Assignments with their role, owning transition or the files that send them.
 * Each row fact names its owning transition and a sample; every other event names the files that send it.
 * EventProducerTest fails on any producer not listed here.
 */
return [
    AssignmentsChanged::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Support/AssignmentFacts.php',
        ],
    ],
];
