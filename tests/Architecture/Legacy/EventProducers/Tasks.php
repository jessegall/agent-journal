<?php

declare(strict_types=1);

use Domain\Tasks\Api\Events\TaskBlocked;
use Domain\Tasks\Api\Events\TaskCancelled;
use Domain\Tasks\Api\Events\TaskFinished;
use Domain\Tasks\Events\TaskStarted;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Tasks with their role, owning transition and the files that send them today (doc 70, table 1).
 * Each migration slice sets migrated, names a sample, and leaves its owner the one producer; EventProducerTest fails
 * on any producer not listed here.
 */
return [
    TaskBlocked::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Task::block',
        'migrated' => false,
        'producers' => [
            'domain/Tasks/src/Handlers/BlockTaskHandler.php',
        ],
    ],
    TaskCancelled::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Task::cancel',
        'migrated' => false,
        'producers' => [
            'domain/Tasks/src/Handlers/CancelTaskHandler.php',
        ],
    ],
    TaskFinished::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Task::finish',
        'migrated' => false,
        'producers' => [
            'domain/Tasks/src/Handlers/FinishTaskHandler.php',
        ],
    ],
    TaskStarted::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Task::start',
        'migrated' => false,
        'producers' => [
            'domain/Tasks/src/Handlers/StartTaskHandler.php',
        ],
    ],
];
