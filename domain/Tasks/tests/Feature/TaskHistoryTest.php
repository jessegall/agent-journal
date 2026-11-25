<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Feature;

use App\Contracts\Bus\CommandBus;
use Domain\Tasks\Commands\BlockTask\BlockTaskCommand;
use Domain\Tasks\Commands\StartTask\StartTaskCommand;
use Domain\Tasks\Contracts\TaskHistoryResolver;
use Domain\Tasks\Enums\TaskStatus;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Domain\Tasks\Tests\TestCase;
use Domain\Tasks\Values\TaskTransition;
use Tests\Support\CommitsHookRows;

/**
 * Each committed change of a task is kept in its history for good, with the run it belonged to, so a later run never
 * rewrites what an earlier run's block said; the history is read a bounded page at a time, newest first.
 */
final class TaskHistoryTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'users',
        'tasks',
        'task_runs',
        'task_history',
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

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();
    }

    public function test_a_block_of_one_run_keeps_its_reason_after_the_next_run_starts(): void
    {
        $task = $this->tasks()->task('task')->taskCalled('task');
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

    public function test_a_history_page_is_bounded_and_continues_before_its_last_entry(): void
    {
        $task = $this->tasks()->task('task')->taskCalled('task');
        $this->journal->actAsUserId($this->journal->ownerUser()->id);
        $this->runCommand(new StartTaskCommand($task->id));
        $this->runCommand(new BlockTaskCommand($task->id, 1, 'Waits.'));
        $this->runCommand(new StartTaskCommand($task->id));

        $history = $this->app->make(TaskHistoryResolver::class);
        $first = $history->historyOf($task->id, null, 2);
        $second = $history->historyOf($task->id, $first->nextBefore, 2);

        $this->assertCount(2, $first->entries);
        $this->assertSame(2, $first->nextBefore);
        $this->assertCount(1, $second->entries);
        $this->assertNull($second->nextBefore);
    }

    private function runCommand(object $command): void
    {
        $this->app->make(CommandBus::class)->run($command);
    }

    private function tasks(): TaskFixtures
    {
        return $this->journal->fixtures(TaskFixtures::class);
    }
}
