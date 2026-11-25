<?php

declare(strict_types=1);

namespace Tests\Mcp;

use App\Mcp\Tools\AssignmentReadTool;
use Domain\Tasks\TasksDomain;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * A record's assignment is read by a main agent; a helper does not see the tool.
 */
#[TestsMcpTool(AssignmentReadTool::class)]
final class AssignmentReadToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        $journal->owner();
        $task = $journal->fixtures(TaskFixtures::class)->task('Ship the dock')->taskCalled('Ship the dock');
        $start = $journal->signedStart('Planner');

        return ToolCall::by($start)
            ->arguments(['record_type' => 'tasks.task', 'record_id' => $task->id])
            ->hiddenFromProfile('read-only-helper');
    }
}
