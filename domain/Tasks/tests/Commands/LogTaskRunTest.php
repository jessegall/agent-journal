<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Commands;

use App\Contracts\Bus\CommandBus;
use Domain\Tasks\Commands\LogTaskRun\LogTaskRunCommand;
use Domain\Tasks\Commands\StartTask\StartTaskCommand;
use Domain\Tasks\Contracts\TaskLogResolver;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskLogEntry;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Domain\Tasks\Tests\TestCase;
use Domain\Tasks\Values\TaskLogLine;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;

/**
 * A task run's log keeps its lines against the run current when they were written, in order, and is read a bounded
 * page at a time in either direction.
 */
#[TestsCommand(LogTaskRunCommand::class)]
final class LogTaskRunTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'users',
        'tasks',
        'task_runs',
        'task_history',
        'task_log_entries',
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

    public function test_lines_keep_their_run_and_order_and_page_in_both_directions(): void
    {
        $task = $this->tasks()->createTask('task');
        $this->journal->actAsUserId($this->journal->ownerUser()->id);
        $this->runCommand(new StartTaskCommand($task->id));

        foreach (range(1, 5) as $line) {
            $this->runCommand(new LogTaskRunCommand($task->id, 1, "Line {$line}."));
        }

        $log = $this->app->make(TaskLogResolver::class);
        $newest = $log->newest($task->id, 2);
        $older = $log->before($task->id, (int) $newest->olderBefore, 2);
        $newer = $log->after($task->id, 3, 10);

        $this->assertSame(['Line 4.', 'Line 5.'], self::texts($newest->lines));

        $this->assertSame([4, 5], [$newest->olderBefore, $newest->newerAfter]);

        $this->assertSame(['Line 2.', 'Line 3.'], self::texts($older->lines));

        $this->assertSame(['Line 4.', 'Line 5.'], self::texts($newer->lines));

        $this->assertSame([1], array_values(array_unique(array_map(
            fn (TaskLogLine $line) => $line->runNumber,
            $newest->lines,
        ))));
    }

    public function test_a_caller_without_the_current_run_cannot_log(): void
    {
        $task = $this->tasks()->createTask('task');
        $this->journal->actAsUserId($this->journal->ownerUser()->id);

        $this->assertThrows(fn () => $this->runCommand(new LogTaskRunCommand($task->id, 1, 'No run yet.')));
        $this->assertSame(0, TaskLogEntry::query()->where('task_id', $task->id)->count());
    }

    /**
     * @param  list<TaskLogLine>  $lines
     * @return list<string>
     */
    private static function texts(array $lines): array
    {
        return array_map(fn (TaskLogLine $line) => $line->text, $lines);
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
