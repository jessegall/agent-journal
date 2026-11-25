<?php

declare(strict_types=1);

namespace Tests\Commands\Sessions;

use App\Commands\Sessions\MarkSilentSessions\MarkSilentSessionsCommand;
use App\Contracts\Bus\CommandBus;
use App\Enums\Agents\StackStatus;
use App\Enums\Sessions\SessionStatus;
use App\Events\Engine\EngineTicked;
use App\Exceptions\EngineAccessRefused;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentStackRow;
use App\Support\CredentialLookup;
use App\Support\EngineListenerSet;
use App\Support\EngineTickedDelivery;
use App\Support\MarkSilentSessionsOnTick;
use App\Support\StartedAgent;
use App\Support\StartSessions;
use App\Support\Ticks\ElapsedTime;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\Agents\BackdatesSessions;
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
    use RunsEnginePasses;

    private const array TABLES = ['agents', 'agent_sessions', 'session_tokens', 'agent_stacks', 'hook_calls'];

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

    private function start(): StartedAgent
    {
        return $this->app->make(StartSessions::class)->start(
            Agent::create('Test agent', 'main-agent', $this->localProject()),
            TestSelections::of('claude-code'),
            TestSelections::requestId(),
        );
    }
}
