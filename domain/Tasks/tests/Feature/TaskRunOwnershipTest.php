<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Feature;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\AgentRequests\Support\SignedCall;
use App\Agents\Actions\LaunchSessions;
use App\Agents\Enums\AgentRole;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Agents\Support\AgentContext;
use App\Bus\Contracts\CommandBus;
use App\Bus\Support\RequestKey;
use Carbon\CarbonImmutable;
use Domain\Tasks\Commands\BlockTask;
use Domain\Tasks\Commands\CancelTask;
use Domain\Tasks\Commands\FinishTask;
use Domain\Tasks\Commands\StartTask;
use Domain\Tasks\Contracts\AssignedTaskResolver;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Exceptions\TaskCancelRefused;
use Domain\Tasks\Exceptions\TaskRestartRefused;
use Domain\Tasks\Exceptions\TaskRunNotYours;
use Domain\Tasks\Exceptions\TaskRunTaken;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Tests\TestCase;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\CommitsHookRows;

/**
 * A task run belongs to the session that started it: another session cannot take it, finish it or block it, a helper
 * cannot cancel it, and an ended task is not started again.
 */
final class TaskRunOwnershipTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['tasks', 'agents', 'agent_sessions', 'launch_credentials', 'agent_stacks', 'hook_calls', 'links', 'command_receipts'];

    private AgentSession $first;

    private AgentSession $second;

    private Task $task;

    protected function setUp(): void
    {
        parent::setUp();

        $this->first = $this->launch('First', 'hooks.main_ready');
        $this->second = $this->launch('Second', 'hooks.read_only_helper_ready');
        $this->task = Task::factory()->create(['title' => 'Owned work']);
    }

    public function test_two_sessions_starting_one_task_leave_one_owner_and_the_winners_keyed_retry_gets_the_same_run(): void
    {
        $this->actAs($this->first);
        $this->app->make(RequestKey::class)->set('01JD8X0G9M3QZ6V4K2STARTKEY1');
        $run = $this->bus()->run(new StartTask($this->task->id, $this->first->id));
        $retry = $this->bus()->run(new StartTask($this->task->id, $this->first->id));

        $this->actAs($this->second);
        $this->assertThrows(fn () => $this->bus()->run(new StartTask($this->task->id, $this->second->id)), TaskRunTaken::class);

        $this->assertSame([1, 1], [$run, $retry]);
        $this->assertSame($this->first->agent_id, $this->task->fresh()?->run_actor_id);
    }

    public function test_finishing_records_the_note_and_ends_the_working_state(): void
    {
        $this->actAs($this->first);
        $run = $this->bus()->run(new StartTask($this->task->id, $this->first->id));

        $this->bus()->run(new FinishTask($this->task->id, $run, 'Built and tested.'));

        $this->assertSame([TaskState::Finished, 'Built and tested.'], [$this->task->fresh()?->state, $this->task->fresh()?->result_note]);
        $this->assertTrue($this->app->make(AssignedTaskResolver::class)->currentForCaller()->isEmpty());
    }

    public function test_blocking_keeps_the_reason_and_another_session_cannot_block_or_finish_the_run(): void
    {
        $this->actAs($this->first);
        $run = $this->bus()->run(new StartTask($this->task->id, $this->first->id));

        $this->actAs($this->second);
        $this->assertThrows(fn () => $this->bus()->run(new FinishTask($this->task->id, $run, 'Not mine.')), TaskRunNotYours::class);

        $this->actAs($this->first);
        $this->assertThrows(fn () => $this->bus()->run(new BlockTask($this->task->id, $run + 1, 'Wrong run.')), TaskRunNotYours::class);
        $this->bus()->run(new BlockTask($this->task->id, $run, 'Waits on review.'));

        $this->assertSame([TaskState::Blocked, 'Waits on review.'], [$this->task->fresh()?->state, $this->task->fresh()?->block_reason]);
    }

    public function test_a_helper_cannot_cancel_another_sessions_run_and_a_main_agent_can(): void
    {
        $this->actAs($this->second);
        $helperTask = Task::factory()->create(['title' => 'Helper work']);
        $this->bus()->run(new StartTask($helperTask->id, $this->second->id));
        $this->actAs($this->first);
        $this->bus()->run(new StartTask($this->task->id, $this->first->id));

        $this->actAs($this->second);
        $this->assertThrows(fn () => $this->bus()->run(new CancelTask($this->task->id, 'Not mine.')), TaskCancelRefused::class);

        $this->actAs($this->first);
        $this->bus()->run(new CancelTask($helperTask->id, 'Superseded.'));

        $this->assertSame([TaskState::Started, TaskState::Cancelled, 'Superseded.'], [$this->task->fresh()?->state, $helperTask->fresh()?->state, $helperTask->fresh()?->cancel_reason]);
    }

    public function test_an_ended_task_is_not_started_again(): void
    {
        $this->actAs($this->first);
        $run = $this->bus()->run(new StartTask($this->task->id, $this->first->id));
        $this->bus()->run(new FinishTask($this->task->id, $run, 'Done.'));

        $this->assertThrows(fn () => $this->bus()->run(new StartTask($this->task->id, $this->first->id)), TaskRestartRefused::class);
    }

    private function launch(string $name, string $role): AgentSession
    {
        $this->app->make(CurrentActorSetter::class)->clear();

        return $this->app->make(LaunchSessions::class)->launch(Agent::named($name, AgentRole::from($role)), TestSelections::of('claude-code'), TestSelections::requestId())->session;
    }

    private function actAs(AgentSession $session): void
    {
        $this->app->forgetScopedInstances();
        $agent = $session->agent()->firstOrFail();
        $this->app->instance(AgentContext::class, new AgentContext($agent->id, $session->id, $agent->role, new SignedCall('call-'.bin2hex(random_bytes(4)), CarbonImmutable::now(), 'digest'), null));
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forAgent($agent->id));
    }

    private function bus(): CommandBus
    {
        return $this->app->make(CommandBus::class);
    }
}
