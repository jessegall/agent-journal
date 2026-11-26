<?php

declare(strict_types=1);

namespace Tests\Routes\Assignments;

use App\Commands\Assignments\ReassignRecord\ReassignRecordCommand;
use App\Enums\Assignments\AssignmentOutcomeType;
use App\Support\ActorReference;
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
 * The owner moves a task from the agent that holds it to another.
 */
#[TestsRoute('POST', 'assignments.reassign')]
final class ReassignPostTest extends GuardedRouteEntryTestCase
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
        $reviewer = $journal->signedStart('Reviewer');
        $assignmentId = strtolower((string) Str::ulid());
        $record = new RecordIdentity('tasks.task', $task->id);

        return RouteCall::as(Caller::User)
            ->payload([
                'recordType' => 'tasks.task',
                'recordId' => $task->id,
                'assignmentId' => $assignmentId,
                'holderType' => 'agent',
                'holderId' => $builder->agent->id,
                'recipientType' => 'agent',
                'recipientId' => $reviewer->agent->id,
            ])
            ->reply(ReassignRecordCommand::class, new AssignmentResult(
                [
                    new AssignmentOutcome($record, null, AssignmentOutcomeType::Changed),
                ],
                [],
            ))
            ->expects(ReassignRecordCommand::class, [
                'record' => $record,
                'expected' => new AssignmentReference(
                    $assignmentId,
                    new AssigneeIdentity('agent', $builder->agent->id),
                ),
                'recipient' => AssigneeIdentity::ofActorReference(ActorReference::of($reviewer->agent)),
            ]);
    }
}
