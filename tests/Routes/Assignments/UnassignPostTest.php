<?php

declare(strict_types=1);

namespace Tests\Routes\Assignments;

use App\Assignments\AssignmentOutcome;
use App\Assignments\Commands\UnassignRecord\UnassignRecordCommand;
use App\Assignments\Enums\AssignmentOutcomeType;
use App\Support\AssigneeIdentity;
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
 * The owner takes a task back from the agent that holds it.
 */
#[TestsRoute('POST', 'assignments.unassign')]
final class UnassignPostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $task = $journal->fixtures(TaskFixtures::class)->createTask('Ship the dock');
        $builder = $journal->signedStart('Builder');
        $assignmentId = strtolower((string) Str::ulid());
        $record = new RecordIdentity('tasks.task', $task->id);

        return RouteCall::as(Caller::User)
            ->payload([
                'recordType' => 'tasks.task',
                'recordId' => $task->id,
                'assignmentId' => $assignmentId,
                'holderType' => 'agent',
                'holderId' => $builder->agent->id,
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
