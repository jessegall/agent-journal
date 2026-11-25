<?php

declare(strict_types=1);

namespace Tests\Mcp;

use App\Commands\Assignments\AssignRecord\AssignRecordCommand;
use App\Enums\Assignments\AssignmentOutcomeType;
use App\Mcp\Tools\AssignRecordTool;
use App\Support\ActorReference;
use App\Support\AssigneeIdentity;
use App\Support\AssignmentOutcome;
use App\Support\AssignmentResult;
use App\Support\RecordIdentity;
use Domain\Tasks\TasksDomain;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Entries\McpToolEntryTestCase;
use Tests\Support\Entries\ToolCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An unheld task is given to an agent: the tool sends the one assign command and presents its outcome.
 */
#[TestsMcpTool(AssignRecordTool::class)]
final class AssignRecordToolTest extends McpToolEntryTestCase
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
        $builder = $journal->signedStart('Builder');
        $record = new RecordIdentity('tasks.task', $task->id);

        return ToolCall::by($start)
            ->forModel($task)
            ->arguments([
                'recipient' => ['type' => 'agent', 'id' => $builder->agent->id],
                'request_key' => 'assign-1',
            ])
            ->reply(AssignRecordCommand::class, new AssignmentResult(
                [new AssignmentOutcome($record, null, AssignmentOutcomeType::Changed)],
                [],
            ))
            ->expects(AssignRecordCommand::class, [
                'record' => $record,
                'recipient' => AssigneeIdentity::ofActorReference(ActorReference::of($builder->agent)),
            ]);
    }
}
