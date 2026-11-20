<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\AgentRequests\Support\SignedCall;
use App\Agents\Actions\StartHeartbeats;
use App\Agents\Actions\StartSessions;
use App\Agents\Commands\RecordHeartbeat;
use App\Agents\Enums\SessionStatus;
use App\Agents\Exceptions\CredentialRejected;
use App\Agents\Models\Agent;
use App\Agents\Support\AgentContext;
use App\Agents\Support\CredentialLookup;
use App\Agents\Support\StackTarget;
use App\Agents\Support\StartedAgent;
use App\Bus\Contracts\CommandBus;
use App\Hooks\Enums\StackStatus;
use App\Hooks\Models\AgentStackRow;
use App\Hooks\Models\HookCall;
use App\Hooks\Storage\FrameRecord;
use Carbon\CarbonImmutable;
use Domain\Tasks\Commands\StartTask;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Models\Task;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\Agents\BackdatesSessions;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestStartAuthority;
use Tests\TestCase;

final class HookRecoveryTest extends TestCase
{
    use BackdatesSessions;
    use CommitsHookRows;

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'start_tokens',
        'agent_stacks',
        'hook_calls',
        'tasks',
        'links',
    ];

    public function test_silence_first_makes_the_session_silent_and_keeps_the_start_working(): void
    {
        $started = $this->start();

        $this->startedSecondsAgo($started, 121);
        $this->heartbeats()->markSilentStarts();

        $this->assertSame(SessionStatus::Silent, $started->session->refresh()->status);
        $this->assertSame(StackStatus::Active, $this->stackOf($started)->status);
        $this->assertSame(
            $started->session->id,
            $this->app->make(CredentialLookup::class)->sessionFor($started->token)->id,
        );
    }

    public function test_a_session_inside_its_presence_window_stays_active(): void
    {
        $started = $this->start();

        $this->startedSecondsAgo($started, 100);
        $this->heartbeats()->markSilentStarts();

        $this->assertSame(SessionStatus::Active, $started->session->refresh()->status);
    }

    public function test_a_heartbeat_makes_a_silent_session_active_again(): void
    {
        $started = $this->start();
        $this->startedSecondsAgo($started, 121);
        $this->heartbeats()->markSilentStarts();

        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forAgent($started->session->agent_id),
            TestStartAuthority::forAgent($started->session->agent_id),
        );
        $this->app->make(CommandBus::class)->run(new RecordHeartbeat($started->session->id));
        $this->heartbeats()->markSilentStarts();

        $this->assertSame(SessionStatus::Active, $started->session->refresh()->status);
        $this->assertNull($started->session->refresh()->end_evidence);
    }

    public function test_a_long_silence_never_ends_the_session_and_keeps_the_credential_and_the_stack(): void
    {
        $started = $this->start();
        $task = $this->startTask($started);

        $this->startedSecondsAgo($started, 17 * 60);
        $this->heartbeats()->markSilentStarts();
        $this->heartbeats()->markSilentStarts();

        $this->assertSame(SessionStatus::Silent, $started->session->refresh()->status);
        $this->assertNull($started->session->refresh()->end_evidence);
        $this->assertSame(
            $started->session->id,
            $this->app->make(CredentialLookup::class)->sessionFor($started->token)->id,
        );
        $this->assertSame(StackStatus::Active, $this->stackOf($started)->status);
        $this->assertSame(
            ['hooks.ready', 'tasks.working'],
            array_map(fn (FrameRecord $frame) => $frame->reference->typeKey, $this->stackOf($started)->frames->all()),
        );
        $this->assertSame(TaskState::Started, $task->fresh()?->state);
        $this->assertSame(0, HookCall::query()->acrossEveryAgent()->count());
    }

    public function test_the_host_reporting_an_exit_ends_the_session_at_once(): void
    {
        $started = $this->start();

        $this->heartbeats()->markExited($started->session, 'exit code 137');

        $this->assertSame(SessionStatus::Ended, $started->session->refresh()->status);
        $this->assertSame('host reported exit: exit code 137', $started->session->refresh()->end_evidence);
        $this->assertSame(StackStatus::Closed, $this->stackOf($started)->status);
        $this->expectException(CredentialRejected::class);
        $this->app->make(CredentialLookup::class)->sessionFor($started->token);
    }

    public function test_a_replacement_start_starts_from_its_own_bottom_and_copies_nothing(): void
    {
        $exited = $this->start();
        $this->startTask($exited);
        $this->heartbeats()->markExited($exited->session, 'killed');

        $replacement = $this->app->make(StartSessions::class)->start(
            $exited->session->loadMissing('agent')->agent,
            TestSelections::of('claude-code'),
            TestSelections::requestId(),
        );

        $this->assertNotSame($exited->session->id, $replacement->session->id);
        $this->assertSame(
            ['hooks.ready'],
            array_map(
                fn (FrameRecord $frame) => $frame->reference->typeKey,
                $this->stackOf($replacement)->frames->all(),
            ),
        );
    }

    private function start(): StartedAgent
    {
        return $this->app->make(StartSessions::class)->start(
            Agent::create('Test agent', 'main-agent'),
            TestSelections::of('claude-code'),
            TestSelections::requestId(),
        );
    }

    private function startTask(StartedAgent $started): Task
    {
        $task = Task::factory()->create(['title' => 'Write the walk']);
        $this->app->instance(
            AgentContext::class,
            new AgentContext(
                $started->session->agent_id,
                $started->session->id,
                new SignedCall('setup', CarbonImmutable::now(), hash('sha256', 'setup')),
                null,
            ),
        );
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forAgent($started->session->agent_id),
            TestStartAuthority::forAgent($started->session->agent_id),
        );
        $this->app->make(CommandBus::class)->run(new StartTask($task->id));
        $this->app->forgetScopedInstances();

        return $task;
    }

    private function stackOf(StartedAgent $started): AgentStackRow
    {
        return AgentStackRow::query()->authorizedFor(
            new StackTarget($started->session->agent_id, $started->session->id),
        )->sole();
    }

    private function heartbeats(): StartHeartbeats
    {
        return $this->app->make(StartHeartbeats::class);
    }
}
