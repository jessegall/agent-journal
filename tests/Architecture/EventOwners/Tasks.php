<?php

declare(strict_types=1);

use App\Actors\Support\ActorIdentity;
use Domain\Tasks\Api\Events\TaskBlocked;
use Domain\Tasks\Api\Events\TaskCancelled;
use Domain\Tasks\Api\Events\TaskCheckRecorded;
use Domain\Tasks\Api\Events\TaskFinished;
use Domain\Tasks\Api\Events\TaskLogged;
use Domain\Tasks\Api\Events\TaskStartCommitted;
use Domain\Tasks\Api\Events\TaskWaitChanged;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Enums\TaskWaitChange;
use Domain\Tasks\Events\TaskDescribed;
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
        'sample' => fn () => new TaskBlocked('task', TaskState::Started, 'entry'),
    ],
    TaskCancelled::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Task::cancel',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new TaskCancelled('task', TaskState::Open, 'entry'),
    ],
    TaskCheckRecorded::class => [
        'role' => EventRole::RowFact,
        'owner' => 'TaskCheck::bind',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new TaskCheckRecorded('task', 'check'),
    ],
    TaskFinished::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Task::finish',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new TaskFinished('task', TaskState::Started, 'entry'),
    ],
    TaskLogged::class => [
        'role' => EventRole::RowFact,
        'owner' => 'TaskLogEntry::create',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new TaskLogged('task', 'entry'),
    ],
    TaskStartCommitted::class => [
        'role' => EventRole::Projection,
        'migrated' => false,
        'producers' => [
            'domain/Tasks/src/Listeners/AnnounceTaskStart.php',
        ],
    ],
    TaskWaitChanged::class => [
        'role' => EventRole::RowFact,
        'owner' => ['TaskWait::create', 'TaskWait::waive', 'TaskWait::remove'],
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new TaskWaitChanged('wait', 'dependent', 'prerequisite', TaskWaitChange::Added),
    ],
    TaskStarted::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Task::start',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new TaskStarted('task', ActorIdentity::system(), TaskState::Open, 'entry'),
    ],
    TaskDescribed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Task::describe',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new TaskDescribed('task'),
    ],
];
