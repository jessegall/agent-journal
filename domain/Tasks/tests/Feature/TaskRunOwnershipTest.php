<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Feature;

use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Processes\RunClaims;
use App\Exceptions\ActorNotAllowed;
use App\Models\Agent;
use App\Models\AgentSession;
use App\Support\ActorContext;
use App\Support\AgentContext;
use App\Support\RequestKey;
use App\Support\SignedCall;
use App\Support\StartSessions;
use Carbon\CarbonImmutable;
use Domain\Tasks\Commands\BlockTask\BlockTaskCommand;
use Domain\Tasks\Commands\CancelTask\CancelTaskCommand;
use Domain\Tasks\Commands\FinishTask\FinishTaskCommand;
use Domain\Tasks\Commands\StartTask\StartTaskCommand;
use Domain\Tasks\Contracts\AssignedTaskResolver;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Exceptions\TaskRestartRefused;
use Domain\Tasks\Exceptions\TaskRunNotYours;
use Domain\Tasks\Exceptions\TaskRunTaken;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskRun;
use Domain\Tasks\Tests\TestCase;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestStartAuthority;

/**
 * A task run belongs to the session that started it: another session cannot take it, finish it or block it, a helper
 * cannot cancel it, and an ended task is not started again.
 */
final class TaskRunOwnershipTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'tasks',
        'task_runs',
        'agents',
        'agent_sessions',
        'start_tokens',
        'agent_stacks',
        'hook_calls',
        'links',
        'assignments',
        'claim_authorizations',
        'command_receipts',
    ];

    private AgentSession $first;

    private AgentSession $second;

    private Task $task;

    protected function setUp(): void
    {
        parent::setUp();

        $this->first = $this->start('First', 'main-agent');
        $this->second = $this->start('Second', 'read-only-helper');
        $this->task = Task::factory()->create(['title' => 'Owned work']);
    }

    public function test_two_sessions_starting_one_task_leave_one_owner_and_a_keyed_retry_gets_the_same_run(): void
    {
        $this->actAs($this->first);
        $this->app->make(RequestKey::class)->set('01JD8X0G9M3QZ6V4K2STARTKEY1');
        $run = $this->bus()->run(new StartTaskCommand($this->task->id));
        $retry = $this->bus()->run(new StartTaskCommand($this->task->id));

        $this->actAs($this->second);
        $this->assertThrows(fn () => $this->bus()->run(new StartTaskCommand($this->task->id)), TaskRunTaken::class);

        $this->assertSame([1, 1], [$run, $retry]);
        $run = TaskRun::query()->where('task_id', $this->task->id)->sole();
        $holder = $this->app->make(RunClaims::class)->holderOf($run->assignmentIdentity())->get();
        $this->assertSame($this->first->agent_id, $holder->id);
    }

    public function test_finishing_records_the_note_and_ends_the_working_state(): void
    {
        $this->actAs($this->first);
        $run = $this->bus()->run(new StartTaskCommand($this->task->id));

        $this->bus()->run(new FinishTaskCommand($this->task->id, $run, 'Built and tested.'));

        $this->assertSame(
            [TaskState::Finished, 'Built and tested.'],
            [$this->task->fresh()?->state, $this->task->fresh()?->result_note],
        );

        $this->assertTrue($this->app->make(AssignedTaskResolver::class)->currentForCaller()->isEmpty());
    }

    public function test_blocking_keeps_the_reason_and_another_session_cannot_block_or_finish_the_run(): void
    {
        $this->actAs($this->first);
        $run = $this->bus()->run(new StartTaskCommand($this->task->id));

        $this->actAs($this->second);

        $this->assertThrows(
            fn () => $this->bus()->run(new FinishTaskCommand($this->task->id, $run, 'Not mine.')),
            ActorNotAllowed::class,
        );

        $this->actAs($this->first);

        $this->assertThrows(
            fn () => $this->bus()->run(new BlockTaskCommand($this->task->id, $run + 1, 'Wrong run.')),
            TaskRunNotYours::class,
        );

        $this->bus()->run(new BlockTaskCommand($this->task->id, $run, 'Waits on review.'));

        $this->assertSame(
            [TaskState::Blocked, 'Waits on review.'],
            [$this->task->fresh()?->state, $this->task->fresh()?->block_reason],
        );
    }

    public function test_another_agent_cannot_cancel_a_run_and_its_holder_can(): void
    {
        $this->actAs($this->second);
        $helperTask = Task::factory()->create(['title' => 'Helper work']);
        $this->bus()->run(new StartTaskCommand($helperTask->id));
        $this->actAs($this->first);
        $this->bus()->run(new StartTaskCommand($this->task->id));

        $this->actAs($this->second);

        $this->assertThrows(
            fn () => $this->bus()->run(new CancelTaskCommand($this->task->id, 'Not mine.')),
            ActorNotAllowed::class,
        );

        $this->actAs($this->second);
        $this->bus()->run(new CancelTaskCommand($helperTask->id, 'Superseded.'));

        $this->assertSame(
            [TaskState::Started, TaskState::Cancelled, 'Superseded.'],
            [$this->task->fresh()?->state, $helperTask->fresh()?->state, $helperTask->fresh()?->cancel_reason],
        );
    }

    public function test_an_ended_task_is_not_started_again(): void
    {
        $this->actAs($this->first);
        $run = $this->bus()->run(new StartTaskCommand($this->task->id));
        $this->bus()->run(new FinishTaskCommand($this->task->id, $run, 'Done.'));

        $this->assertThrows(fn () => $this->bus()->run(new StartTaskCommand($this->task->id)), TaskRestartRefused::class);
    }

    private function start(string $name, string $profileKey): AgentSession
    {
        $this->app->make(CurrentActorSetter::class)->clear();

        return $this->app->make(StartSessions::class)->start(
            Agent::create($name, $profileKey),
            TestSelections::of('claude-code'),
            TestSelections::requestId(),
        )->session;
    }

    private function actAs(AgentSession $session): void
    {
        $this->app->forgetScopedInstances();
        $agent = $session->agent()->firstOrFail();

        $this->app->instance(
            AgentContext::class,
            new AgentContext(
                $agent->id,
                $session->id,
                new SignedCall('call-'.bin2hex(random_bytes(4)), CarbonImmutable::now(), 'digest'),
                null,
            ),
        );

        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forAgent($agent->id),
            TestStartAuthority::forAgent($agent->id),
        );
    }

    private function bus(): CommandBus
    {
        return $this->app->make(CommandBus::class);
    }
}
