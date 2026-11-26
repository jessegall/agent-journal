<?php

declare(strict_types=1);

namespace Tests\Mcp;

use App\Assignments\AssignmentOutcome;
use App\Assignments\Commands\ReassignRecord\ReassignRecordCommand;
use App\Assignments\Enums\AssignmentOutcomeType;
use App\Mcp\Tools\ReassignRecordTool;
use App\Support\ActorReference;
use App\Support\AssigneeIdentity;
use App\Support\AssignmentResult;
use App\Support\RecordIdentity;
use Domain\Tasks\TasksDomain;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Illuminate\Support\Str;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * A held task moves to another agent: the tool sends the one reassign command, naming the assignment it expects.
 */
#[TestsMcpTool(ReassignRecordTool::class)]
final class ReassignRecordToolTest extends McpToolEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    protected function arrange(TestJournal $journal): ToolCall
    {
        $journal->owner();
        $task = $journal->fixtures(TaskFixtures::class)->createTask('Ship the dock');
        $start = $journal->signedStart('Planner');
        $first = $journal->signedStart('Builder');
        $second = $journal->signedStart('Reviewer');
        $record = new RecordIdentity('tasks.task', $task->id);

        return ToolCall::by($start)
            ->forModel($task)
            ->arguments([
                'expected_assignment' => [
                    'id' => (string) Str::ulid(),
                    'holder' => ['type' => 'agent', 'id' => $first->agent->id],
                ],
                'recipient' => ['type' => 'agent', 'id' => $second->agent->id],
                'request_key' => 'reassign-1',
            ])
            ->reply(ReassignRecordCommand::class, new AssignmentResult(
                [new AssignmentOutcome($record, null, AssignmentOutcomeType::Changed)],
                [],
            ))
            ->expects(ReassignRecordCommand::class, [
                'record' => $record,
                'recipient' => AssigneeIdentity::ofActorReference(ActorReference::of($second->agent)),
            ]);
    }
}
