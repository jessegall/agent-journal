<?php

declare(strict_types=1);

namespace Tests\Routes\Assignments;

use App\Commands\Assignments\DisableAutoAssignment\DisableAutoAssignmentCommand;
use App\Support\ActorReference;
use App\Support\AutoAssignmentChange;
use App\Support\AutoAssignmentKey;
use Domain\Tasks\TasksDomain;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent stops an agent taking tasks on its own.
 */
#[TestsRoute('POST', 'assignments.agent.auto.disable')]
final class AgentAutoDisablePostTest extends GuardedRouteEntryTestCase
{
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $journal->owner();
        $start = $journal->signedStart('Planner');
        $builder = $journal->signedStart('Builder');

        return RouteCall::as(Caller::Agent, $start)
            ->payload([
                'actor_type' => 'agent',
                'actor_id' => $builder->agent->id,
                'assignable_type' => 'tasks.task',
                'expected_revision' => 0,
                'request_key' => 'autodisable-1',
            ])
            ->reply(DisableAutoAssignmentCommand::class, new AutoAssignmentChange(true, 1))
            ->expects(DisableAutoAssignmentCommand::class, [
                'key' => new AutoAssignmentKey(ActorReference::of($builder->agent), 'tasks.task'),
                'expectedRevision' => 0,
            ]);
    }
}
