<?php

declare(strict_types=1);

use App\Actors\Support\ActorIdentity;
use Domain\Tasks\Api\Events\TaskBlocked;
use Domain\Tasks\Api\Events\TaskCancelled;
use Domain\Tasks\Api\Events\TaskFinished;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Events\TaskStarted;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Tasks with their role, owning transition or the files that send them.
 * Each row fact names its owning transition and a sample; every other event names the files that send it.
 * EventProducerTest fails on any producer not listed here.
 */
return [
    TaskBlocked::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Task::block',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new TaskBlocked('task', TaskState::Started),
    ],
    TaskCancelled::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Task::cancel',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new TaskCancelled('task', TaskState::Open),
    ],
    TaskFinished::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Task::finish',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new TaskFinished('task', TaskState::Started),
    ],
    TaskStarted::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Task::start',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new TaskStarted('task', ActorIdentity::system(), TaskState::Open),
    ],
];
