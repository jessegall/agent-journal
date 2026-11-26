<?php

declare(strict_types=1);

namespace Tests\Routes\Assignments;

use App\Commands\Assignments\AssignRecord\AssignRecordCommand;
use App\Enums\Assignments\AssignmentOutcomeType;
use App\Support\ActorReference;
use App\Support\AssigneeIdentity;
use App\Support\AssignmentOutcome;
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
 * The owner gives a task to an agent.
 */
#[TestsRoute('POST', 'assignments.assign')]
final class AssignPostTest extends GuardedRouteEntryTestCase
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
        $record = new RecordIdentity('tasks.task', $task->id);

        return RouteCall::as(Caller::User)
            ->payload([
                'recordType' => 'tasks.task',
                'recordId' => $task->id,
                'recipientType' => 'agent',
                'recipientId' => $builder->agent->id,
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
