<?php

declare(strict_types=1);

namespace Tests\Commands\Sessions;

use App\Commands\Agents\OpenAgentRuntime\OpenAgentRuntimeCommand;
use App\Commands\Sessions\MarkSilentSessions\MarkSilentSessionsCommand;
use App\Contracts\Bus\CommandBus;
use App\Enums\Agents\StackStatus;
use App\Enums\Drivers\DriverType;
use App\Enums\Sessions\SessionStatus;
use App\Events\Engine\EngineTicked;
use App\Exceptions\EngineAccessRefused;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\Agents\AgentStackRow;
use App\Support\CredentialLookup;
use App\Support\EngineListenerSet;
use App\Support\EngineTickedDelivery;
use App\Support\EnrolledHost;
use App\Support\MarkSilentSessionsOnTick;
use App\Support\OpenedRuntime;
use App\Support\StartedAgent;
use App\Support\StartHeartbeats;
use App\Support\Ticks\ElapsedTime;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;
use Tests\Support\Agents\BackdatesSessions;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\Engine\RunsEnginePasses;
use Tests\TestCase;

/**
 * Each engine pass sweeps for silent sessions under its agents.silence grant: a session past its presence window turns
 * silent and keeps its credential and stack; the sweep command refuses the engine without that grant.
 */
final class MarkSilentSessionsTest extends TestCase
{
    use BackdatesSessions;
    use CommitsHookRows;
    use OpensLedgerRuntimes;
    use RunsEnginePasses;

    private int $startCount = 0;

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'hosts',
        'agent_runtimes',
        'driver_requests',
        'driver_turns',
        'accounts',
        'active_accounts',
        'session_processes',
        'links',
    ];

    private const string FOLDER = '/work/project';

    public function test_the_agents_area_registers_the_sweep_with_the_engine(): void
    {
        $this->assertTrue($this->app->make(EngineListenerSet::class)->has(MarkSilentSessionsOnTick::class));
    }

    public function test_one_pass_makes_a_session_past_its_window_silent_and_keeps_its_credential_and_stack(): void
    {
        $stale = $this->start();
        $fresh = $this->start();
        $this->startedSecondsAgo($stale, 121);

        $this->pass(fn () => $this->app->make(EngineTickedDelivery::class)->deliver(
            new EngineTicked(CarbonImmutable::now(), ElapsedTime::between(0, 1_000_000_000)),
        ));

        $this->assertSame(SessionStatus::Silent, $stale->session->refresh()->status);
        $this->assertSame(SessionStatus::Active, $fresh->session->refresh()->status);
        $this->assertSame(
            $stale->session->id,
            $this->app->make(CredentialLookup::class)->sessionFor($stale->token)->id,
        );
        $this->assertSame(
            StackStatus::Active,
            AgentStackRow::query()->authorizedFor(
                new StackTarget($stale->session->agent_id, $stale->session->id),
            )->sole()->status,
        );
    }

    public function test_the_sweep_refuses_the_engine_without_its_grant(): void
    {
        $stale = $this->start();
        $this->startedSecondsAgo($stale, 121);

        $this->assertThrows(
            fn () => $this->pass(fn () => $this->app->make(CommandBus::class)->run(new MarkSilentSessionsCommand())),
            EngineAccessRefused::class,
        );

        $this->assertSame(SessionStatus::Active, $stale->session->refresh()->status);
    }

    public function test_a_session_long_silent_while_its_host_beats_for_another_is_ended_as_unserved(): void
    {
        [$host, $served] = $this->openRuntime();
        $unserved = $this->secondRuntimeOn($host);
        AgentSession::query()->whereKey($served->sessionId)->update(['last_heartbeat_at' => CarbonImmutable::now()]);
        $this->silenceSince($unserved, CarbonImmutable::now()->subMinutes(11));

        $this->app->make(StartHeartbeats::class)->markSilentStarts();

        $this->assertSame(
            [true, false],
            [
                AgentSession::query()->findOrFail($served->sessionId)->isActive(),
                AgentSession::query()->findOrFail($unserved->sessionId)->isActive(),
            ],
        );
    }

    private function start(): StartedAgent
    {
        $name = 'Test agent '.++$this->startCount;

        return $this->journal->idleAgent($name)->startSession($name, $name)->startCalled($name);
    }

    private function secondRuntimeOn(EnrolledHost $host): OpenedRuntime
    {
        return $this->asOwner(new OpenAgentRuntimeCommand(
            Agent::create('Second agent', 'main-agent', $this->localProject())->id,
            $host->hostId,
            self::FOLDER,
            'claude-code',
            '2.1.323',
            'claude',
            DriverType::Headless,
            'claude-opus-5-5',
        ));
    }

    private function silenceSince(OpenedRuntime $opened, CarbonImmutable $since): void
    {
        AgentSession::query()->whereKey($opened->sessionId)->update([
            'status' => SessionStatus::Silent->value,
            'silent_since' => $since,
            'last_heartbeat_at' => $since->subMinutes(5),
        ]);
    }
}
