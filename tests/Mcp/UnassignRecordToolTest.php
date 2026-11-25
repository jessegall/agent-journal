<?php

declare(strict_types=1);

namespace Tests\Mcp;

use App\Commands\Assignments\UnassignRecord\UnassignRecordCommand;
use App\Enums\Assignments\AssignmentOutcomeType;
use App\Mcp\Tools\UnassignRecordTool;
use App\Support\AssignmentOutcome;
use App\Support\AssignmentResult;
use App\Support\RecordIdentity;
use Domain\Tasks\TasksDomain;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Tests\Support\Bus\ExpectedCommand;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * A held task is given back: the tool sends the one unassign command, naming the assignment it expects.
 */
#[TestsMcpTool(UnassignRecordTool::class)]
final class UnassignRecordToolTest extends McpToolEntryTestCase
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
        $holder = $journal->signedStart('Builder');
        $record = new RecordIdentity('tasks.task', $task->id);

        return ToolCall::by($start)
            ->forModel($task)
            ->arguments([
                'expected_assignment' => [
                    'id' => '01jd8x0g9m3qz6v4k2t7r5w1ce',
                    'holder' => ['type' => 'agent', 'id' => $holder->agent->id],
                ],
                'request_key' => 'unassign-1',
            ])
            ->reply(UnassignRecordCommand::class, new AssignmentResult(
                [new AssignmentOutcome($record, null, AssignmentOutcomeType::Changed)],
                [],
            ))
            ->expects(ExpectedCommand::of(UnassignRecordCommand::class, ['record' => $record]));
    }
}
