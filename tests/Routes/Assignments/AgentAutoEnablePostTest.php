<?php

declare(strict_types=1);

namespace Tests\Routes\Assignments;

use App\Assignments\AutoAssignmentChange;
use App\Assignments\Commands\EnableAutoAssignment\EnableAutoAssignmentCommand;
use App\Support\ActorReference;
use App\Support\AutoAssignmentInput;
use App\Support\AutoAssignmentKey;
use App\Support\PoolReference;
use Domain\Tasks\TasksDomain;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\Caller;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;

/**
 * An agent gives an agent the pool of open tasks to take on its own.
 */
#[TestsRoute('POST', 'assignments.agent.auto.enable')]
final class AgentAutoEnablePostTest extends GuardedRouteEntryTestCase
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
                'pool' => 'tasks.open',
                'records' => [],
                'size' => 1,
                'expected_revision' => 0,
                'target' => null,
                'request_key' => 'autoenable-1',
            ])
            ->reply(EnableAutoAssignmentCommand::class, new AutoAssignmentChange(true, 1))
            ->expects(EnableAutoAssignmentCommand::class, [
                'input' => new AutoAssignmentInput(
                    new AutoAssignmentKey(ActorReference::of($builder->agent), 'tasks.task'),
                    new PoolReference('tasks.open', null, []),
                    1,
                ),
                'expectedRevision' => 0,
            ]);
    }
}
