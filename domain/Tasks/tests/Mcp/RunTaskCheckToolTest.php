<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Mcp;

use Domain\Tasks\Commands\RunTaskCheck\RunTaskCheckCommand;
use Domain\Tasks\Mcp\Tools\RunTaskCheckTool;
use Domain\Tasks\TasksDomain;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Illuminate\Support\Str;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent records a check of its task run against a process run it started, and is given the check.
 */
#[TestsMcpTool(RunTaskCheckTool::class)]
final class RunTaskCheckToolTest extends McpToolEntryTestCase
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
        $check = $journal->actAs('Builder')->processRun('Check', 'cat composer.json')->processRunCalled('Check');

        return ToolCall::by($start)
            ->arguments([
                'task_id' => $task->id,
                'run_number' => 1,
                'process_run_id' => $check->id,
                'operation' => 'Run the tests.',
                'request_key' => 'tasks-1',
            ])
            ->reply(RunTaskCheckCommand::class, (string) Str::ulid())
            ->expects(RunTaskCheckCommand::class, [
                'taskId' => $task->id,
                'runNumber' => 1,
                'processRunId' => $check->id,
            ]);
    }
}
