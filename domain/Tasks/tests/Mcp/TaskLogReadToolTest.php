<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Mcp;

use Domain\Tasks\Commands\LogTaskRun\LogTaskRunCommand;
use Domain\Tasks\Mcp\Tools\TaskLogReadTool;
use Domain\Tasks\TasksDomain;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent reads one log entry of a task whole.
 */
#[TestsMcpTool(TaskLogReadTool::class)]
final class TaskLogReadToolTest extends McpToolEntryTestCase
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
        $entry = $journal->actAs('Builder')->run(new LogTaskRunCommand($task->id, 1, 'Wired the route.'));

        return ToolCall::by($start)->arguments([
            'task_id' => $task->id,
            'entry_id' => $entry,
        ]);
    }
}
