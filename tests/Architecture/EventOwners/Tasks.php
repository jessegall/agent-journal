<?php

declare(strict_types=1);

use App\Support\ActorIdentity;
use Domain\Tasks\Enums\TaskStatus;
use Domain\Tasks\Enums\TaskWaitChange;
use Domain\Tasks\Events\TaskBlocked;
use Domain\Tasks\Events\TaskCancelled;
use Domain\Tasks\Events\TaskCheckRecorded;
use Domain\Tasks\Events\TaskDescribed;
use Domain\Tasks\Events\TaskFinished;
use Domain\Tasks\Events\TaskLogged;
use Domain\Tasks\Events\TaskRunClaimed;
use Domain\Tasks\Events\TaskRunEnded;
use Domain\Tasks\Events\TaskStartCommitted;
use Domain\Tasks\Events\TaskStarted;
use Domain\Tasks\Events\TaskWaitChanged;
use Tests\Architecture\Support\EventRole;

/**
 * The events of Tasks with their role, owning transition or the files that send them.
 * Each row fact names its owning transition and a sample; every other event names the files that send it.
 * EventProducerTest fails on any producer not listed here.
 */
return [
    TaskRunClaimed::class => [
        'role' => EventRole::CommandFact,
        'migrated' => false,
        'producers' => [
            'domain/Tasks/src/Commands/ResumeTaskRun/ResumeTaskRunHandler.php',
            'domain/Tasks/src/Commands/StartTask/StartTaskHandler.php',
        ],
    ],
    TaskBlocked::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Task::block',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new TaskBlocked('task', TaskStatus::Started, 'entry'),
    ],
    TaskCancelled::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Task::cancel',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new TaskCancelled('task', TaskStatus::Open, 'entry'),
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
        'sample' => fn () => new TaskFinished('task', TaskStatus::Started, 'entry'),
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
        'sample' => fn () => new TaskStarted('task', ActorIdentity::system(), TaskStatus::Open, 'entry'),
    ],
    TaskDescribed::class => [
        'role' => EventRole::RowFact,
        'owner' => 'Task::describe',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new TaskDescribed('task'),
    ],
    TaskRunEnded::class => [
        'role' => EventRole::RowFact,
        'owner' => 'TaskRun::finish',
        'migrated' => true,
        'producers' => [],
        'sample' => fn () => new TaskRunEnded('run', 'task'),
    ],
];
