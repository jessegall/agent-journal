<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Feature;

use App\Actors\Support\ActorIdentity;
use App\Agents\Actions\LaunchSessions;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Assignments\Contracts\AssignmentTransaction;
use App\Assignments\Models\AssignmentRecord;
use App\Assignments\Support\AssigneeIdentity;
use App\Bus\Contracts\CommandBus;
use App\Bus\Support\RequestKey;
use App\Desks\Contracts\RunClaims;
use App\Desks\Exceptions\RunClaimRefused;
use App\Desks\Models\DeskRecord;
use App\Desks\Support\DeskSeating;
use App\Desks\Support\SeatChange;
use Domain\Tasks\Commands\ResumeTaskRun;
use Domain\Tasks\Commands\StartTask;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskRun;
use Domain\Tasks\Tests\TestCase;
use Illuminate\Support\Str;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\ActsAsOwner;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;

/**
 * A released run is resumed explicitly: a new desk occupant takes it with the same number while the former one is
 * refused, and a direct holder that lost and regained the task cannot use its old claim but resumes afresh.
 */
final class ResumeTaskRunTest extends TestCase
{
    use ActsAsOwner;
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

    public function test_a_new_occupant_resumes_the_run_and_the_former_one_is_refused(): void
    {
        $desk = DeskRecord::openNamed('team', 'Team', 1, false);
        $leaving = $this->launched('First');
        $arriving = $this->launched('Second');
        $task = Task::factory()->create();
        AssignmentRecord::holding($task->assignmentIdentity(), $desk->assigneeIdentity());
        $this->startUserRequestAs($this->owner->id);
        $seat = $this->app->make(AssignmentTransaction::class)->run(
            fn () => $this->app->make(DeskSeating::class)->seat(
                $desk->id,
                ActorIdentity::of($leaving->agent()->firstOrFail()),
            ),
        );
        $this->runAs($leaving, new StartTask($task->id));
        $run = TaskRun::query()->where('task_id', $task->id)->sole();
        $this->startUserRequestAs($this->owner->id);
        $this->app->make(AssignmentTransaction::class)->run(fn () => $this->app->make(DeskSeating::class)->replace(
            new SeatChange(
                $desk->id,
                $seat->seatId,
                $seat->reference,
                ActorIdentity::of($arriving->agent()->firstOrFail()),
            ),
        ));

        $this->assertSame(1, $this->runAs($arriving, new ResumeTaskRun($run->id)));
        $this->assertTrue($this->holderOf($run)?->isSameAs(ActorIdentity::of($arriving->agent()->firstOrFail())));
        $this->assertSame(1, TaskRun::query()->where('task_id', $task->id)->count());
        $this->assertThrows(fn () => $this->runAs($leaving, new ResumeTaskRun($run->id)), RunClaimRefused::class);
    }

    public function test_a_direct_holder_that_regained_the_task_resumes_afresh(): void
    {
        $worker = $this->launched('Third');
        $task = Task::factory()->create();
        $holding = AssignmentRecord::holding(
            $task->assignmentIdentity(),
            AssigneeIdentity::of($worker->agent()->firstOrFail()),
        );
        $this->runAs($worker, new StartTask($task->id));
        $run = TaskRun::query()->where('task_id', $task->id)->sole();

        $holding->delete();
        AssignmentRecord::holding($task->assignmentIdentity(), AssigneeIdentity::of($worker->agent()->firstOrFail()));

        $this->assertNull($this->holderOf($run));
        $this->assertSame(1, $this->runAs($worker, new ResumeTaskRun($run->id)));
        $this->assertTrue($this->holderOf($run)?->isSameAs(ActorIdentity::of($worker->agent()->firstOrFail())));
    }

    private function runAs(AgentSession $launch, StartTask|ResumeTaskRun $command): int
    {
        $this->startRequestAs($launch->agent_id, $launch->id);
        $this->app->make(RequestKey::class)->set((string) Str::ulid());

        return $this->app->make(CommandBus::class)->run($command);
    }

    private function holderOf(TaskRun $run): ActorIdentity|null
    {
        return $this->app->make(RunClaims::class)->holderOf($run->assignmentIdentity())->getOrElse(null);
    }

    private function launched(string $name): AgentSession
    {
        return $this->app->make(LaunchSessions::class)
            ->launch(Agent::named($name, 'main-agent'), TestSelections::of('claude-code'), TestSelections::requestId())
            ->session;
    }
}
