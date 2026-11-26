<?php

declare(strict_types=1);

namespace Tests\Routes\Assignments;

use App\Assignments\AssignmentOutcome;
use App\Assignments\Commands\AssignRecord\AssignRecordCommand;
use App\Assignments\Enums\AssignmentOutcomeType;
use App\Support\ActorReference;
use App\Support\AssigneeIdentity;
use App\Support\AssignmentResult;
use App\Support\RecordIdentity;
use Domain\Tasks\TasksDomain;
use Domain\Tasks\Tests\Fixtures\TaskFixtures;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent gives a task to an agent.
 */
#[TestsRoute('POST', 'assignments.agent.assign')]
final class AgentAssignPostTest extends GuardedRouteEntryTestCase
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
        $record = new RecordIdentity('tasks.task', $task->id);

        return RouteCall::as(Caller::Agent, $start)
            ->payload([
                'record_type' => 'tasks.task',
                'record_id' => $task->id,
                'recipient_type' => 'agent',
                'recipient_id' => $builder->agent->id,
                'request_key' => 'assign-1',
            ])
            ->reply(AssignRecordCommand::class, new AssignmentResult(
                [
                    new AssignmentOutcome($record, null, AssignmentOutcomeType::Changed),
                ],
                [],
            ))
            ->expects(AssignRecordCommand::class, [
                'record' => $record,
                'recipient' => AssigneeIdentity::ofActorReference(ActorReference::of($builder->agent)),
            ]);
    }
}
