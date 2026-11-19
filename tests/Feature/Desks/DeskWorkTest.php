<?php

declare(strict_types=1);

namespace Tests\Feature\Desks;

use App\Actors\Support\ActorIdentity;
use App\Agents\Enums\AgentRole;
use App\Agents\Models\Agent;
use App\Assignments\Contracts\AssignmentResolver;
use App\Assignments\Contracts\AssignmentTransaction;
use App\Assignments\Models\AssignmentRecord;
use App\Desks\Contracts\SeatingWriter;
use App\Desks\Models\DeskRecord;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Plans\Models\Plan;
use Domain\Tasks\Models\Task;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

/**
 * Work a desk holds is the work of every actor seated there: two occupants both see the desk's tasks and plans, an
 * actor without a seat sees none.
 */
final class DeskWorkTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgentRequests;

    private const array TABLES = [
        'users',
        'agents',
        'tasks',
        'plans',
        'inboxes',
        'desks',
        'desk_seats',
        'desk_preferences',
        'assignments',
    ];

    public function test_two_occupants_see_the_desks_work_and_an_unseated_actor_sees_none(): void
    {
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->startUserRequestAs($owner->id);
        $desk = DeskRecord::openNamed('team', 'Team', 2, false);
        $first = Agent::named('First', AgentRole::ReadOnlyHelper);
        $second = Agent::named('Second', AgentRole::ReadOnlyHelper);
        $outsider = Agent::named('Outsider', AgentRole::ReadOnlyHelper);

        foreach ([$first, $second] as $agent) {
            $this->app->make(AssignmentTransaction::class)->run(
                fn () => $this->app->make(SeatingWriter::class)->seat($desk->id, ActorIdentity::of($agent)),
            );
        }

        $task = Task::factory()->create();
        $plan = Plan::factory()->create();
        AssignmentRecord::holding($task->assignmentIdentity(), $desk->assigneeIdentity());
        AssignmentRecord::holding($plan->assignmentIdentity(), $desk->assigneeIdentity());
        $assignments = $this->app->make(AssignmentResolver::class);

        foreach ([$first, $second] as $agent) {
            $this->assertSame([$task->id], $assignments->allRecordIdsFor(Task::LINK_TYPE, $agent->assigneeIdentity()));
            $this->assertSame([$plan->id], $assignments->allRecordIdsFor(Plan::LINK_TYPE, $agent->assigneeIdentity()));
        }

        $this->assertSame([], $assignments->allRecordIdsFor(Task::LINK_TYPE, $outsider->assigneeIdentity()));
    }
}
