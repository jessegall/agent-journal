<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Mcp;

use Domain\Tasks\Commands\BlockTask\BlockTaskCommand;
use Domain\Tasks\Mcp\Tools\BlockTaskTool;
use Domain\Tasks\TasksDomain;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Tests\Support\Bus\ExpectedCommand;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent blocks its run of a task with what it waits on.
 */
#[TestsMcpTool(BlockTaskTool::class)]
final class BlockTaskToolTest extends McpToolEntryTestCase
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
                'reason' => 'Waits on the dock route.',
                'request_key' => 'tasks-1',
            ])
            ->expects(ExpectedCommand::of(BlockTaskCommand::class, [
                'taskId' => $task->id,
                'runNumber' => 1,
            ]));
    }
}
