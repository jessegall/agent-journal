<?php

declare(strict_types=1);

namespace Tests\Routes\Assignments;

use App\Commands\Assignments\UnassignRecord\UnassignRecordCommand;
use App\Enums\Assignments\AssignmentOutcomeType;
use App\Support\AssigneeIdentity;
use App\Support\AssignmentOutcome;
use App\Support\AssignmentReference;
use App\Support\AssignmentResult;
use App\Support\RecordIdentity;
use Domain\Tasks\TasksDomain;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Illuminate\Support\Str;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent takes a task back from the agent that holds it.
 */
#[TestsRoute('POST', 'assignments.agent.unassign')]
final class AgentUnassignPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $task = $journal->fixtures(TaskFixtures::class)->createTask('Ship the dock');
        $start = $journal->signedStart('Planner');
        $builder = $journal->signedStart('Builder');
        $assignmentId = strtolower((string) Str::ulid());
        $record = new RecordIdentity('tasks.task', $task->id);

        return RouteCall::as(Caller::Agent, $start)
            ->payload([
                'record_type' => 'tasks.task',
                'record_id' => $task->id,
                'assignment_id' => $assignmentId,
                'holder_type' => 'agent',
                'holder_id' => $builder->agent->id,
                'request_key' => 'unassign-1',
            ])
            ->reply(UnassignRecordCommand::class, new AssignmentResult(
                [
                    new AssignmentOutcome($record, null, AssignmentOutcomeType::Changed),
                ],
                [],
            ))
            ->expects(UnassignRecordCommand::class, [
                'record' => $record,
                'expected' => new AssignmentReference(
                    $assignmentId,
                    new AssigneeIdentity('agent', $builder->agent->id),
                ),
            ]);
    }
}
