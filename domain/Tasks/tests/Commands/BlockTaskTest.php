<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Commands;

use App\Exceptions\CommandInputInvalid;
use Domain\Tasks\Commands\BlockTask\BlockTaskCommand;
use Domain\Tasks\Commands\StartTask\StartTaskCommand;
use Domain\Tasks\Enums\TaskStatus;
use Domain\Tasks\Exceptions\TaskRunOfAnotherActor;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Tests\TestCase;
use Tests\Support\CommitsHookRows;
use Tests\Support\Seeding\SeedsJournal;

/**
 * The agent that runs a task blocks it with the reason it waits; a run that is not the current one and a blank or
 * empty reason are refused, and the task still runs.
 */
final class BlockTaskTest extends TestCase
{
    use CommitsHookRows;
    use SeedsJournal;

    private const array TABLES = ['tasks', 'task_runs', 'claim_authorizations'];

    private Task $task;

    private int $run;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal()->owner()->agent('First');
        $this->task = Task::create('Owned work', 'Build it.', $this->journal()->ownerUser());
        $this->run = $this->journal()->actAs('First')->run(new StartTaskCommand($this->task->id));
    }

    public function test_a_blocked_task_keeps_the_reason_it_waits(): void
    {
        $this->journal()->run(new BlockTaskCommand($this->task->id, $this->run, 'Waits on review.'));

        $this->assertSame(
            [TaskStatus::Blocked, 'Waits on review.'],
            [$this->task->refresh()->status, $this->task->block_reason],
        );
    }

    public function test_another_run_and_a_blank_or_empty_reason_are_refused_and_the_task_still_runs(): void
    {
        $this->assertThrows(
            fn () => $this->journal()->run(new BlockTaskCommand($this->task->id, $this->run + 1, 'Wrong run.')),
            TaskRunOfAnotherActor::class,
        );

        foreach (['   ', ''] as $reason) {
            $this->assertThrows(
                fn () => $this->journal()->run(new BlockTaskCommand($this->task->id, $this->run, $reason)),
                CommandInputInvalid::class,
                'reason:',
            );
        }

        $this->assertSame(TaskStatus::Started, $this->task->refresh()->status);
    }
}
