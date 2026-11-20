<?php

declare(strict_types=1);

namespace Domain\Plans\Tests\Feature;

use App\Actors\Support\ActorIdentity;
use App\Agents\Models\Agent;
use App\Assignments\Contracts\AssignmentTransaction;
use App\Assignments\Models\AssignmentRecord;
use App\Bus\Contracts\CommandBus;
use App\Bus\Support\RequestKey;
use App\Desks\Models\DeskRecord;
use App\Desks\Support\DeskSeating;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Plans\Commands\AssignPlanWork;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Plan;
use Domain\Plans\Tests\TestCase;
use Domain\Tasks\Models\Task;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;

/**
 * Giving a plan's unfinished work to the actor seated at main puts the whole batch on main, resolved once, and the
 * result names both the actor asked for and the desk that holds the work.
 */
final class DeskPlanAssignmentTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgentRequests;

    private const array TABLES = [
        'users',
        'agents',
        'tasks',
        'plans',
        'phases',
        'phase_tasks',
        'inboxes',
        'desks',
        'desk_seats',
        'desk_preferences',
        'assignments',
        'command_receipts',
    ];

    public function test_a_plan_given_to_the_actor_at_main_is_held_by_main_as_one_batch(): void
    {
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->startUserRequestAs($owner->id);
        $main = DeskRecord::openNamed('main', 'Main inbox', 1, true);
        $agent = Agent::named('Main', 'main-agent');
        $this->app->make(AssignmentTransaction::class)->run(
            fn () => $this->app->make(DeskSeating::class)->seat($main->id, ActorIdentity::of($agent)),
        );
        $plan = Plan::factory()->create(['title' => 'Release', 'type' => PlanType::Build]);
        $phase = $plan->addPhase('Working');
        $tasks = [Task::factory()->create(), Task::factory()->create()];
        $phase->addTasks(array_map(fn (Task $task) => $task->id, $tasks));
        $this->app->make(RequestKey::class)->set((string) Str::ulid());

        $result = $this->app->make(CommandBus::class)->run(
            new AssignPlanWork($plan->assignmentIdentity(), $agent->assigneeIdentity()),
        );

        $records = array_map(fn ($record) => $record->assignmentIdentity(), [$plan, $phase, ...$tasks]);
        $assignments = AssignmentRecord::query()->forRecords($records)->readLimit(count($records))->get();

        $this->assertCount(count($records), $assignments);
        foreach ($assignments as $assignment) {
            $this->assertTrue($assignment->toAssignment()->holder()->isSameAs($main->assigneeIdentity()));
        }

        $this->assertTrue($result->requests[0]->requested->isSameAs($agent->assigneeIdentity()));
        $this->assertTrue($result->requests[0]->resolved->isSameAs($main->assigneeIdentity()));
    }
}
