<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Commands\Agents\RecordHeartbeat\RecordHeartbeatCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Enums\Agents\StackStatus;
use App\Enums\Sessions\SessionStatus;
use App\Exceptions\CredentialRejected;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentStackRow;
use App\Models\Drivers\HookCall;
use App\Support\ActorContext;
use App\Support\AgentContext;
use App\Support\CredentialLookup;
use App\Support\HeartbeatService;
use App\Support\SignedCall;
use App\Support\StartedAgent;
use App\Support\StartSessions;
use App\Support\Storage\FrameRecord;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;
use Domain\Tasks\Commands\StartTask\StartTaskCommand;
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

    private const string EXIT_CODE = 'exit code 137';

    private const string EXIT_EVIDENCE = 'host reported exit: %s';

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
        $this->app->make(CommandBus::class)->run(new RecordHeartbeatCommand($started->session->id));
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
            ['core.ready', 'tasks.work'],
            array_map(fn (FrameRecord $frame) => $frame->reference->typeKey, $this->stackOf($started)->frames->all()),
        );
        $this->assertSame(TaskState::Started, $task->fresh()?->state);
        $this->assertSame(0, HookCall::query()->acrossEveryAgent()->count());
    }

    public function test_a_session_keeps_an_end_reason_longer_than_a_short_text_column(): void
    {
        $started = $this->start();
        $reason = str_repeat('the agent image leaves an item unenforced; ', 12);

        $started->session->endWithEvidenceAt(CarbonImmutable::now(), $reason);

        $this->assertSame($reason, $started->session->refresh()->end_evidence);
    }

    public function test_the_host_reporting_an_exit_ends_the_session_at_once(): void
    {
        $started = $this->start();

        $this->heartbeats()->markExited($started->session, self::EXIT_CODE);

        $this->assertSame(SessionStatus::Ended, $started->session->refresh()->status);
        $this->assertSame(sprintf(self::EXIT_EVIDENCE, self::EXIT_CODE), $started->session->refresh()->end_evidence);
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
            ['core.ready'],
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
        $this->app->make(CommandBus::class)->run(new StartTaskCommand($task->id));
        $this->app->forgetScopedInstances();

        return $task;
    }

    private function stackOf(StartedAgent $started): AgentStackRow
    {
        return AgentStackRow::query()->authorizedFor(
            new StackTarget($started->session->agent_id, $started->session->id),
        )->sole();
    }

    private function heartbeats(): HeartbeatService
    {
        return $this->app->make(HeartbeatService::class);
    }
}
