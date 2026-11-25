<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Commands;

use App\Contracts\Bus\CommandBus;
use App\Exceptions\CommandInputInvalid;
use Domain\Tasks\Commands\BlockTask\BlockTaskCommand;
use Domain\Tasks\Commands\StartTask\StartTaskCommand;
use Domain\Tasks\Contracts\TaskHistoryResolver;
use Domain\Tasks\Enums\TaskStatus;
use Domain\Tasks\Exceptions\TaskRunOfAnotherActor;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Domain\Tasks\Tests\TestCase;
use Domain\Tasks\Values\TaskTransition;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;

/**
 * The agent that runs a task blocks it with the reason it waits; a run that is not the current one and a blank or
 * empty reason are refused, and the task still runs.
 */
#[TestsCommand(BlockTaskCommand::class)]
final class BlockTaskTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'tasks',
        'task_runs',
        'claim_authorizations',
        'users',
        'task_history',
        'agents',
        'agent_sessions',
        'agent_stacks',
        'assignments',
        'command_receipts',
        'number_groups',
        'inboxes',
        'inbox_members',
    ];

    private Task $task;

    private int $run;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->agent('First');
        $this->task = $this->tasks()->createTask('Owned work', 'Build it.');
        $this->run = $this->journal->actAs('First')->run(new StartTaskCommand($this->task->id));
    }

    public function test_a_blocked_task_keeps_the_reason_it_waits(): void
    {
        $this->journal->run(new BlockTaskCommand($this->task->id, $this->run, 'Waits on review.'));

        $this->assertSame(
            [
                TaskStatus::Blocked,
                'Waits on review.',
            ],
            [
                $this->task->refresh()->status,
                $this->task->block_reason,
            ],
        );
    }

    public function test_another_run_and_a_blank_or_empty_reason_are_refused_and_the_task_still_runs(): void
    {
        $this->assertThrows(
            fn () => $this->journal->run(new BlockTaskCommand($this->task->id, $this->run + 1, 'Wrong run.')),
            TaskRunOfAnotherActor::class,
        );

        foreach ([
            '   ',
            '',
        ] as $reason) {
            $this->assertThrows(
                fn () => $this->journal->run(new BlockTaskCommand($this->task->id, $this->run, $reason)),
                CommandInputInvalid::class,
                'reason:',
            );
        }

        $this->assertSame(TaskStatus::Started, $this->task->refresh()->status);
    }

    public function test_a_block_of_one_run_keeps_its_reason_after_the_next_run_starts(): void
    {

        $task = $this->tasks()->createTask('task');
        $this->journal->actAsUserId($this->journal->ownerUser()->id);

        $this->runCommand(new StartTaskCommand($task->id));
        $this->runCommand(new BlockTaskCommand($task->id, 1, 'Waits for the schema.'));
        $this->runCommand(new StartTaskCommand($task->id));

        $history = $this->app->make(TaskHistoryResolver::class)->historyOf($task->id, null, 10);

        $this->assertSame(
            [
                [
                    2,
                    TaskStatus::Blocked,
                    TaskStatus::Started,
                    null,
                ],
                [
                    1,
                    TaskStatus::Started,
                    TaskStatus::Blocked,
                    'Waits for the schema.',
                ],
                [
                    1,
                    TaskStatus::Open,
                    TaskStatus::Started,
                    null,
                ],
            ],
            array_map(
                fn (TaskTransition $entry) => [
                    $entry->runNumber,
                    $entry->fromState,
                    $entry->toState,
                    $entry->text,
                ],
                $history->entries,
            ),
        );

        $this->assertSame([
            3,
            2,
            1,
        ], array_map(fn (TaskTransition $entry) => $entry->sequence, $history->entries));
    }

    private function tasks(): TaskFixtures
    {
        return $this->journal->fixtures(TaskFixtures::class);
    }

    private function runCommand(object $command): void
    {
        $this->app->make(CommandBus::class)->run($command);
    }
}
