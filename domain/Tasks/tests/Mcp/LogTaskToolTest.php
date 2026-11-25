<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Mcp;

use Domain\Tasks\Commands\LogTaskRun\LogTaskRunCommand;
use Domain\Tasks\Mcp\Tools\LogTaskTool;
use Domain\Tasks\TasksDomain;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Illuminate\Support\Str;
use Tests\Support\Bus\ExpectedCommand;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent logs a line on its run of a task and is given the entry.
 */
#[TestsMcpTool(LogTaskTool::class)]
final class LogTaskToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        $start = $journal->owner()->signedStart('Builder');
        $tasks = $journal->fixtures(TaskFixtures::class)->task('Ship the dock')->startRun('Ship the dock', 'Builder');
        $task = $tasks->taskCalled('Ship the dock');

        return ToolCall::by($start)
            ->arguments([
                'task_id' => $task->id,
                'run_number' => 1,
                'text' => 'Wired the route.',
                'request_key' => 'tasks-1',
            ])
            ->reply(LogTaskRunCommand::class, (string) Str::ulid())
            ->expects(ExpectedCommand::of(LogTaskRunCommand::class, [
                'taskId' => $task->id,
                'runNumber' => 1,
                'text' => 'Wired the route.',
            ]));
    }
}
