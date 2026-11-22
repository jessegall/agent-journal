<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Feature;

use App\Contracts\Bus\CommandBus;
use Domain\Tasks\Commands\BlockTask\BlockTaskCommand;
use Domain\Tasks\Commands\LogTaskRun\LogTaskRunCommand;
use Domain\Tasks\Commands\StartTask\StartTaskCommand;
use Domain\Tasks\Data\TaskStreamEntryData;
use Domain\Tasks\Enums\TaskStreamEntryType;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Support\TaskStream;
use Domain\Tasks\Tests\TestCase;
use Spatie\LaravelData\Optional;
use Tests\Support\ActsAsOwner;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;

/**
 * A task's Logs merge its changes and its log lines into one stream, each entry with its run, and page it with a
 * cursor that remembers where each of the two reads stands.
 */
final class TaskStreamTest extends TestCase
{
    use ActsAsOwner;
    use CommitsHookRows;
    use StartsAgentRequests;

    private const string LOG_TEXT = 'Read <b>the</b> schema.';

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
    ];

    public function test_changes_and_log_lines_come_in_one_stream_with_their_runs_and_page_to_the_start(): void
    {
        $task = Task::factory()->create();
        $this->startUserRequestAs($this->owner->id);
        $bus = $this->app->make(CommandBus::class);
        $bus->run(new StartTaskCommand($task->id));
        $bus->run(new LogTaskRunCommand($task->id, 1, self::LOG_TEXT));
        $bus->run(new LogTaskRunCommand($task->id, 1, 'Wrote it.'));
        $bus->run(new BlockTaskCommand($task->id, 1, 'Waits.'));

        $page = $this->app->make(TaskStream::class)->page($task->id, '');

        $this->assertCount(4, $page->entries);

        $this->assertEqualsCanonicalizing(
            [TaskStreamEntryType::Change, TaskStreamEntryType::Change, TaskStreamEntryType::Log, TaskStreamEntryType::Log],
            array_map(fn (TaskStreamEntryData $entry) => $entry->type, $page->entries),
        );

        $this->assertSame(
            [1, 1, 1, 1],
            array_map(fn (TaskStreamEntryData $entry) => $entry->runNumber, $page->entries),
        );

        $this->assertContains(
            self::LOG_TEXT,
            array_map(fn (TaskStreamEntryData $entry) => $entry->text, $page->entries),
        );

        $this->assertInstanceOf(Optional::class, $page->olderBefore);
    }
}
