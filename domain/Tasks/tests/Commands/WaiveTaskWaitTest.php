<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Commands;

use Domain\Tasks\Commands\AddTaskWait\AddTaskWaitCommand;
use Domain\Tasks\Commands\WaiveTaskWait\WaiveTaskWaitCommand;
use Domain\Tasks\Contracts\TaskWaitResolver;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskWait;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Domain\Tasks\Tests\TestCase;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;

/**
 * The owner waives a wait with a reason, kept with who and when, and the task is ready; an empty reason is refused.
 */
#[TestsCommand(WaiveTaskWaitCommand::class)]
final class WaiveTaskWaitTest extends TestCase
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

        $this->first = $this->tasks()->createTask('Prepare records');
        $this->second = $this->tasks()->createTask('Publish records');
        $this->journal->actAsUserId($this->journal->ownerUser()->id);
    }

    public function test_a_waiver_needs_a_reason_and_keeps_who_and_when(): void
    {
        $this->runCommand(new AddTaskWaitCommand($this->second->id, $this->first->id));

        $this->assertThrows(
            fn () => $this->runCommand(new WaiveTaskWaitCommand($this->second->id, $this->first->id, '')),
        );

        $this->runCommand(new WaiveTaskWaitCommand($this->second->id, $this->first->id, 'Done by hand.'));

        $wait = TaskWait::findBetween($this->second->id, $this->first->id);
        $this->assertNotNull($wait?->waived_at);

        $this->assertSame([
            $this->journal->ownerUser()->id,
            'Done by hand.',
        ], [
            $wait->waived_by_id,
            $wait->waive_reason,
        ]);

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

    private function tasks(): TaskFixtures
    {
        return $this->journal->fixtures(TaskFixtures::class);
    }
}
