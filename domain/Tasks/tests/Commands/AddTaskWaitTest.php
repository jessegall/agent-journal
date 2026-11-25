<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Commands;

use Domain\Tasks\Commands\AddTaskWait\AddTaskWaitCommand;
use Domain\Tasks\Exceptions\TaskWaitRefused;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskWait;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Domain\Tasks\Tests\TestCase;
use Tests\Support\CommitsHookRows;

/**
 * A task is made to wait on another; a wait that would close a cycle and a task waiting on itself are refused and
 * add nothing.
 */
final class AddTaskWaitTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'users',
        'tasks',
        'task_runs',
        'task_history',
        'task_waits',
        'task_wait_history',
        'agents',
        'agent_sessions',
        'agent_stacks',
        'assignments',
        'claim_authorizations',
        'command_receipts',
        'number_groups',
        'inboxes',
        'inbox_members',
    ];

    private Task $first;

    private Task $second;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();

        $this->first = $this->tasks()->task('Prepare records')->taskCalled('Prepare records');
        $this->second = $this->tasks()->task('Publish records')->taskCalled('Publish records');
        $this->journal->actAsUserId($this->journal->ownerUser()->id);
    }

    public function test_a_cycle_and_a_self_link_are_refused(): void
    {
        $this->runCommand(new AddTaskWaitCommand($this->second->id, $this->first->id));

        $this->assertThrows(
            fn () => $this->runCommand(new AddTaskWaitCommand($this->first->id, $this->second->id)),
            TaskWaitRefused::class,
        );

        $this->assertThrows(
            fn () => $this->runCommand(new AddTaskWaitCommand($this->first->id, $this->first->id)),
            TaskWaitRefused::class,
        );

        $this->assertSame(1, TaskWait::query()->count());
    }

    private function runCommand(object $command): void
    {
        $this->journal->run($command);
    }

    private function tasks(): TaskFixtures
    {
        return $this->journal->fixtures(TaskFixtures::class);
    }
}
