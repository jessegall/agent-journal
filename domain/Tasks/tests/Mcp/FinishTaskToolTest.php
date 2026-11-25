<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Mcp;

use Domain\Tasks\Commands\FinishTask\FinishTaskCommand;
use Domain\Tasks\Mcp\Tools\FinishTaskTool;
use Domain\Tasks\TasksDomain;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Tests\Support\Bus\ExpectedCommand;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent finishes its run of a task with a closing note.
 */
#[TestsMcpTool(FinishTaskTool::class)]
final class FinishTaskToolTest extends McpToolEntryTestCase
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
                'note' => 'Docked.',
                'request_key' => 'tasks-1',
            ])
            ->expects(ExpectedCommand::of(FinishTaskCommand::class, [
                'taskId' => $task->id,
                'runNumber' => 1,
                'note' => 'Docked.',
            ]));
    }
}
