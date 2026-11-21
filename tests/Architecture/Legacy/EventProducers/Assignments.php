<?php

declare(strict_types=1);

use App\Assignments\Events\AssignmentsChanged;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Assignments with their role, owning transition and the files that send them today (doc 70, table 1).
 * Each migration slice sets migrated, names a sample, and leaves its owner the one producer; EventProducerTest fails
 * on any producer not listed here.
 */
return [
    AssignmentsChanged::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Assignments/Support/AssignmentFacts.php',
        ],
    ],
];
