<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Agents\Actions\LaunchSessions;
use App\Agents\Enums\SessionStatus;
use App\Agents\Models\Agent;
use App\Agents\Support\CredentialLookup;
use App\Agents\Support\LaunchedAgent;
use App\Agents\Support\StackTarget;
use App\Bus\Contracts\CommandBus;
use App\Engine\Commands\MarkSilentSessions;
use App\Engine\Events\EngineTicked;
use App\Engine\Exceptions\EngineAccessRefused;
use App\Engine\Support\EngineListenerSet;
use App\Engine\Support\EngineTickedDelivery;
use App\Engine\Support\MarkSilentSessionsOnTick;
use App\Hooks\Enums\StackStatus;
use App\Hooks\Models\AgentStackRow;
use App\Hooks\Ticks\ElapsedTime;
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
final class SilenceSweepOnTickTest extends TestCase
{
    use BackdatesSessions;
    use CommitsHookRows;
    use RunsEnginePasses;

    private const array TABLES = ['agents', 'agent_sessions', 'launch_credentials', 'agent_stacks', 'hook_calls'];

    public function test_the_agents_area_registers_the_sweep_with_the_engine(): void
    {
        $this->assertTrue($this->app->make(EngineListenerSet::class)->has(MarkSilentSessionsOnTick::class));
    }

    public function test_one_pass_makes_a_session_past_its_window_silent_and_keeps_its_credential_and_stack(): void
    {
        $stale = $this->launch();
        $fresh = $this->launch();
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
        $stale = $this->launch();
        $this->startedSecondsAgo($stale, 121);

        $this->assertThrows(
            fn () => $this->pass(fn () => $this->app->make(CommandBus::class)->run(new MarkSilentSessions())),
            EngineAccessRefused::class,
        );

        $this->assertSame(SessionStatus::Active, $stale->session->refresh()->status);
    }

    private function launch(): LaunchedAgent
    {
        return $this->app->make(LaunchSessions::class)->launch(
            Agent::named('Test agent', 'main-agent'),
            TestSelections::of('claude-code'),
            TestSelections::requestId(),
        );
    }
}
