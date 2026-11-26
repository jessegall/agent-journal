<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Mcp;

use Domain\Tasks\Commands\EditTask\EditTaskCommand;
use Domain\Tasks\Mcp\Tools\EditTaskTool;
use Domain\Tasks\TasksDomain;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent edits a task at the revision it read.
 */
#[TestsMcpTool(EditTaskTool::class)]
final class EditTaskToolTest extends McpToolEntryTestCase
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
                'expected_revision' => 1,
                'title' => 'Ship the dock today',
                'request_key' => 'tasks-1',
            ])
            ->reply(EditTaskCommand::class, 2)
            ->expects(EditTaskCommand::class, ['taskId' => $task->id, 'expectedRevision' => 1]);
    }
}
