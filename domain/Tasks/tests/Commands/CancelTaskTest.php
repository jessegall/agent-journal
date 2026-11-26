<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Commands;

use App\Bus\Exceptions\CommandInputInvalid;
use App\Exceptions\ActorNotAllowed;
use Domain\Tasks\Commands\CancelTask\CancelTaskCommand;
use Domain\Tasks\Commands\StartTask\StartTaskCommand;
use Domain\Tasks\Enums\TaskStatus;
use Domain\Tasks\Exceptions\TaskChangedSinceRead;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Domain\Tasks\Tests\TestCase;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;

/**
 * The agent that runs a task cancels it with its reason; another agent, a run that moved on since it was read, a
 * blank reason and a task that already ended are refused.
 */
#[TestsCommand(CancelTaskCommand::class)]
final class CancelTaskTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'tasks',
        'task_runs',
        'claim_authorizations',
    ];

    private Task $task;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->agent('First')->agent('Second', 'read-only-helper');
        $this->task = $this->tasks()->createTask('Owned work', 'Build it.');
        $this->journal->actAs('First')->run(new StartTaskCommand($this->task->id));
    }

    public function test_the_runner_cancels_with_its_reason(): void
    {
        $this->journal->run(new CancelTaskCommand($this->task->id, 'Superseded.'));

        $this->assertSame(
            [TaskStatus::Cancelled, 'Superseded.'],
            [$this->task->refresh()->status, $this->task->cancel_reason],
        );
    }

    public function test_another_agent_a_moved_run_and_a_blank_reason_are_refused(): void
    {
        $this->assertThrows(
            fn () => $this->journal->actAs('Second')->run(new CancelTaskCommand($this->task->id, 'Not mine.')),
            ActorNotAllowed::class,
        );

        $this->journal->actAs('First');

        $this->assertThrows(
            fn () => $this->journal->run(new CancelTaskCommand($this->task->id, 'Stale.', expectedRunNumber: 2)),
            TaskChangedSinceRead::class,
        );

        $this->assertThrows(
            fn () => $this->journal->run(new CancelTaskCommand($this->task->id, ' ')),
            CommandInputInvalid::class,
            'reason:',
        );

        $this->assertSame(TaskStatus::Started, $this->task->refresh()->status);
    }

    public function test_a_task_that_ended_is_not_cancelled_again(): void
    {
        $this->journal->run(new CancelTaskCommand($this->task->id, 'Superseded.'));

        $this->assertThrows(
            fn () => $this->journal->run(new CancelTaskCommand($this->task->id, 'Again.')),
            TaskChangedSinceRead::class,
        );
    }

    private function tasks(): TaskFixtures
    {
        return $this->journal->fixtures(TaskFixtures::class);
    }
}
