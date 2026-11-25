<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Commands;

use Domain\Tasks\Commands\AddTaskWait\AddTaskWaitCommand;
use Domain\Tasks\Commands\CancelTask\CancelTaskCommand;
use Domain\Tasks\Commands\RemoveTaskWait\RemoveTaskWaitCommand;
use Domain\Tasks\Contracts\TaskWaitResolver;
use Domain\Tasks\Enums\TaskWaitChange;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskWaitHistory;
use Domain\Tasks\Tests\TestCase;
use Tests\Support\ActsAsOwner;
use Tests\Support\CommitsHookRows;

/**
 * A wait whose prerequisite was cancelled still holds its task until it is removed; the removal frees the task and
 * the history keeps every change.
 */
final class RemoveTaskWaitTest extends TestCase
{
    use ActsAsOwner;
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
    ];

    private Task $first;

    private Task $second;

    protected function setUp(): void
    {
        parent::setUp();

        $this->first = Task::factory()->create(['title' => 'Prepare records']);
        $this->second = Task::factory()->create(['title' => 'Publish records']);
        $this->journal->actAsUserId($this->owner->id);
    }

    public function test_a_cancelled_prerequisite_leaves_the_wait_outstanding_and_history_keeps_every_change(): void
    {
        $this->runCommand(new AddTaskWaitCommand($this->second->id, $this->first->id));
        $this->runCommand(new CancelTaskCommand($this->first->id, 'Not needed.'));

        $this->assertSame([], $this->waits()->readyAmong([$this->second->id]));
        $waits = $this->waits()->waitsOf($this->second->id);
        $this->assertFalse($waits->waitsFor[0]->isSatisfied);
        $this->assertSame($this->second->id, $this->waits()->waitsOf($this->first->id)->holdsUp[0]->taskId);

        $this->runCommand(new RemoveTaskWaitCommand($this->second->id, $this->first->id));

        $this->assertSame(
            [
                TaskWaitChange::Added,
                TaskWaitChange::Removed,
            ],
            TaskWaitHistory::query()->orderBy('created_at')->orderBy('id')->pluck('change')->all(),
        );

        $this->assertSame([$this->second->id], $this->waits()->readyAmong([$this->second->id]));
    }

    private function waits(): TaskWaitResolver
    {
        return $this->app->make(TaskWaitResolver::class);
    }

    private function runCommand(object $command): void
    {
        $this->journal->run($command);
    }
}
