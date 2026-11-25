<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Mcp;

use Domain\Tasks\Commands\StartTask\StartTaskCommand;
use Domain\Tasks\Mcp\Tools\StartTaskTool;
use Domain\Tasks\TasksDomain;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Tests\Support\Bus\ExpectedCommand;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent takes an open task in hand and is given its run number.
 */
#[TestsMcpTool(StartTaskTool::class)]
final class StartTaskToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        $start = $journal->owner()->signedStart('Builder');
        $task = $journal->fixtures(TaskFixtures::class)->createTask('Ship the dock');

        return ToolCall::by($start)
            ->arguments([
                'task_id' => $task->id,
                'request_key' => 'tasks-1',
            ])
            ->reply(StartTaskCommand::class, 1)
            ->expects(ExpectedCommand::of(StartTaskCommand::class, ['taskId' => $task->id]));
    }
}
