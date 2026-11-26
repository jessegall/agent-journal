<?php

declare(strict_types=1);

use App\Events\Assignments\AssignmentsChanged;
use App\Events\Assignments\AssignmentsEnded;
use App\Events\Assignments\AutoAssignmentConfigured;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Assignments with their role, owning transition or the files that send them.
 * Each row fact names its owning transition and a sample; every other event names the files that send it.
 * EventProducerTest fails on any producer not listed here.
 */
return [
    AssignmentsEnded::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Assignments/ClaimRelease.php',
            'app/Assignments/Storage/AssignmentStorage.php',
        ],
    ],
    AssignmentsChanged::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'app/Assignments/AssignmentFactPublisher.php',
        ],
    ],
    AutoAssignmentConfigured::class => [
        'role' => EventRole::RowFact,
        'owner' => 'AutoAssignment::configure',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new AutoAssignmentConfigured('auto', true, 1),
    ],
];
