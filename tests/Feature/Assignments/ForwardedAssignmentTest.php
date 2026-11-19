<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Actors\Support\ActorIdentity;
use App\Agents\Models\Agent;
use App\Assignments\Commands\AssignRecord;
use App\Assignments\Commands\UnassignRecord;
use App\Assignments\Contracts\AssignmentTransaction;
use App\Assignments\Models\AssignmentRecord;
use App\Bus\Contracts\CommandBus;
use App\Bus\Enums\CommandEntry;
use App\Bus\Exceptions\RequestKeyConflict;
use App\Bus\Support\EntryDispatchers;
use App\Bus\Support\RequestKey;
use App\Desks\Commands\InstallDesks;
use App\Desks\Contracts\ActorDesks;
use App\Desks\Contracts\SeatingWriter;
use App\Desks\Models\DeskRecord;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Tasks\Models\Task;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

/**
 * A task given to the actor seated at main is held by main, and the outcome names both the actor asked for and the
 * desk that holds it; an actor without a forwarding seat keeps the task itself.
 */
final class ForwardedAssignmentTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgentRequests;

    private const array TABLES = [
        'users',
        'agents',
        'tasks',
        'inboxes',
        'desks',
        'desk_seats',
        'desk_preferences',
        'assignments',
        'command_receipts',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->startUserRequestAs($owner->id);
        $this->app->make(EntryDispatchers::class)
            ->runAsJournal(CommandEntry::HostControl, 'desk install', new InstallDesks());
    }

    public function test_a_task_given_to_the_actor_at_main_is_held_by_main_and_names_both(): void
    {
        $main = DeskRecord::query()->named('main')->sole();
        $agent = $this->withDesk(Agent::named('Main', 'main-agent'));
        $this->app->make(AssignmentTransaction::class)->run(
            fn () => $this->app->make(SeatingWriter::class)->seat($main->id, ActorIdentity::of($agent)),
        );
        $task = Task::factory()->create()->assignmentIdentity();

        $this->app->make(RequestKey::class)->set((string) Str::ulid());
        $result = $this->app->make(CommandBus::class)->run(new AssignRecord($task, $agent->assigneeIdentity()));

        $held = AssignmentRecord::query()->forRecord($task)->sole()->toAssignment()->holder();
        $this->assertTrue($held->isSameAs($main->assigneeIdentity()));
        $this->assertTrue($result->requests[0]->requested->isSameAs($agent->assigneeIdentity()));
        $this->assertTrue($result->requests[0]->resolved->isSameAs($main->assigneeIdentity()));
    }

    public function test_an_actor_without_a_forwarding_seat_keeps_the_task(): void
    {
        $agent = $this->withDesk(Agent::named('Builder', 'read-only-helper'));
        $task = Task::factory()->create()->assignmentIdentity();

        $this->app->make(RequestKey::class)->set((string) Str::ulid());
        $this->app->make(CommandBus::class)->run(new AssignRecord($task, $agent->assigneeIdentity()));

        $held = AssignmentRecord::query()->forRecord($task)->sole()->toAssignment()->holder();
        $this->assertTrue($held->isSameAs($agent->assigneeIdentity()));
    }

    public function test_a_retry_with_the_same_key_returns_the_first_result_after_the_assignment_was_removed(): void
    {
        $agent = $this->withDesk(Agent::named('Builder', 'read-only-helper'));
        $task = Task::factory()->create()->assignmentIdentity();
        $bus = $this->app->make(CommandBus::class);
        $this->app->make(RequestKey::class)->set('assign-the-builder');
        $first = $bus->run(new AssignRecord($task, $agent->assigneeIdentity()));
        $this->app->make(RequestKey::class)->set('unassign-the-builder');
        $bus->run(new UnassignRecord($task, $first->outcomes[0]->current->reference));

        $this->app->make(RequestKey::class)->set('assign-the-builder');
        $retry = $bus->run(new AssignRecord($task, $agent->assigneeIdentity()));

        $this->assertEquals($first, $retry);
        $this->assertSame(0, AssignmentRecord::query()->forRecord($task)->count());
    }

    public function test_a_changed_recipient_under_the_same_key_conflicts(): void
    {
        $builder = $this->withDesk(Agent::named('Builder', 'read-only-helper'));
        $reviewer = $this->withDesk(Agent::named('Reviewer', 'read-only-helper'));
        $task = Task::factory()->create()->assignmentIdentity();
        $bus = $this->app->make(CommandBus::class);
        $this->app->make(RequestKey::class)->set('assign-once');
        $bus->run(new AssignRecord($task, $builder->assigneeIdentity()));

        $this->app->make(RequestKey::class)->set('assign-once');

        $this->assertThrows(
            fn () => $bus->run(new AssignRecord($task, $reviewer->assigneeIdentity())),
            RequestKeyConflict::class,
        );
    }

    private function withDesk(Agent $agent): Agent
    {
        $this->app->make(AssignmentTransaction::class)->run(
            fn () => $this->app->make(ActorDesks::class)->provision(ActorIdentity::of($agent), $agent->name),
        );

        return $agent;
    }
}
