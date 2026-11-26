<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Mcp;

use Domain\Tasks\Commands\CancelTask\CancelTaskCommand;
use Domain\Tasks\Mcp\Tools\CancelTaskTool;
use Domain\Tasks\TasksDomain;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent cancels the task whose run it holds, with the reason it is no longer needed.
 */
#[TestsMcpTool(CancelTaskTool::class)]
final class CancelTaskToolTest extends McpToolEntryTestCase
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
            ->arguments(['task_id' => $task->id, 'reason' => 'Not needed.', 'request_key' => 'tasks-1'])
            ->expects(CancelTaskCommand::class, ['taskId' => $task->id, 'reason' => 'Not needed.']);
    }
}
