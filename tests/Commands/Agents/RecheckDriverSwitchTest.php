<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Commands\Agents\RecheckDriverSwitch\RecheckDriverSwitchCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Drivers\DriverCatalogue;
use App\Enums\Drivers\DriverSwitchStage;
use App\Enums\Drivers\DriverType;
use App\Models\Agents\AgentSession;
use App\Models\Drivers\DriverSwitch;
use App\Support\ActorContext;
use App\Support\DefaultDrivers;
use App\Support\StartSessions;
use App\Values\ChosenAccount;
use App\Values\DriverSwitchTarget;
use App\Values\OwnerAuthority;
use Illuminate\Support\Str;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * The owner rechecks a switch that waits on the host: a stop with no reported process is marked unconfirmed and waits.
 */
final class RecheckDriverSwitchTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'driver_switches',
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'links',
        'command_receipts',
    ];

    private AgentSession $session;

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(1)),
            new OwnerAuthority('test'),
        );
        $agent = $this->journal->idleAgent('Main agent', 'main-agent')->agentCalled('Main agent');
        $this->session = $this->app->make(StartSessions::class)
            ->start($agent, TestSelections::of('claude-code'), TestSelections::requestId())
            ->session;
    }

    public function test_a_stop_with_no_reported_process_waits_unconfirmed(): void
    {
        $switch = $this->switch();
        $switch->markPreflighted();
        $switch->beginStopping(null);

        $this->app->make(CommandBus::class)->run(new RecheckDriverSwitchCommand($switch->id));

        $this->assertSame(DriverSwitchStage::StopUnconfirmed, $switch->refresh()->stage);
    }

    private function switch(): DriverSwitch
    {
        return DriverSwitch::create(
            strtolower((string) Str::ulid()),
            $this->session,
            0,
            new DriverSwitchTarget(
                DefaultDrivers::CODEX,
                DriverType::Headless,
                new ChosenAccount(strtolower((string) Str::ulid()), 0),
                null,
                false,
            ),
            $this->app->make(DriverCatalogue::class)->pinned(DefaultDrivers::CODEX, DriverType::Headless),
            'owner',
        );
    }
}
