<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Feature;

use App\Actors\Exceptions\ActorNotAllowed;
use App\Actors\Support\ActorIdentity;
use App\Agents\Actions\LaunchSessions;
use App\Agents\Enums\AgentRole;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Assignments\Contracts\AssignmentTransaction;
use App\Assignments\Models\AssignmentRecord;
use App\Bus\Contracts\CommandBus;
use App\Desks\Contracts\RunClaims;
use App\Desks\Contracts\SeatingWriter;
use App\Desks\Models\DeskRecord;
use App\Desks\Support\SeatChange;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Tasks\Commands\FinishTask;
use Domain\Tasks\Commands\StartTask;
use Domain\Tasks\Enums\TaskRunState;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskRun;
use Domain\Tasks\Tests\TestCase;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;

/**
 * A task run is its own record claimed through Core: starting opens run 1 claimed by the starter, finishing ends the
 * claim and keeps the run, and an actor that lost its desk seat cannot finish the desk's run.
 */
final class TaskRunTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgentRequests;

    private const array TABLES = [
        'users',
        'tasks',
        'task_runs',
        'agents',
        'agent_sessions',
        'launch_credentials',
        'agent_stacks',
        'hook_calls',
        'links',
        'inboxes',
        'desks',
        'desk_seats',
        'desk_preferences',
        'assignments',
        'claim_authorizations',
        'command_receipts',
    ];

    private User $owner;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
    }

    public function test_starting_opens_a_claimed_run_and_finishing_ends_the_claim(): void
    {
        $task = Task::factory()->create();
        $this->startUserRequestAs($this->owner->id);
        $bus = $this->app->make(CommandBus::class);

        $runNumber = $bus->run(new StartTask($task->id));
        $run = TaskRun::query()->where('task_id', $task->id)->sole();

        $this->assertSame(1, $runNumber);
        $this->assertTrue($this->holderOf($run)?->isSameAs(ActorIdentity::of($this->owner)));

        $bus->run(new FinishTask($task->id, 1, 'Done'));

        $this->assertSame(TaskRunState::Finished, $run->refresh()->state);
        $this->assertNull($this->holderOf($run));
    }

    public function test_an_actor_that_lost_its_desk_seat_cannot_finish_the_desk_run(): void
    {
        $desk = DeskRecord::openNamed('team', 'Team', 1, false);
        $leaving = $this->launched('First');
        $arriving = $this->launched('Second');
        $task = Task::factory()->create();
        AssignmentRecord::holding($task->assignmentIdentity(), $desk->assigneeIdentity());
        $this->startUserRequestAs($this->owner->id);
        $seat = $this->app->make(AssignmentTransaction::class)->run(
            fn () => $this->app->make(SeatingWriter::class)->seat($desk->id, ActorIdentity::of($leaving->agent()->firstOrFail())),
        );
        $this->startRequestAs($leaving->agent_id, $leaving->id);
        $this->app->make(CommandBus::class)->run(new StartTask($task->id));

        $this->startUserRequestAs($this->owner->id);
        $this->app->make(AssignmentTransaction::class)->run(fn () => $this->app->make(SeatingWriter::class)->replace(
            new SeatChange($desk->id, $seat->seatId, $seat->reference, ActorIdentity::of($arriving->agent()->firstOrFail())),
        ));
        $this->startRequestAs($leaving->agent_id, $leaving->id);

        $this->assertThrows(
            fn () => $this->app->make(CommandBus::class)->run(new FinishTask($task->id, 1, 'Done')),
            ActorNotAllowed::class,
        );
    }

    private function holderOf(TaskRun $run): ActorIdentity|null
    {
        return $this->app->make(RunClaims::class)->holderOf($run->assignmentIdentity())->getOrElse(null);
    }

    private function launched(string $name): AgentSession
    {
        return $this->app->make(LaunchSessions::class)
            ->launch(Agent::named($name, AgentRole::MainAgent), TestSelections::of('claude-code'), TestSelections::requestId())
            ->session;
    }
}
