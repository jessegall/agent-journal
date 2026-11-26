<?php

declare(strict_types=1);

namespace Tests\Commands\Drivers;

use App\Access\Values\OwnerAuthority;
use App\Accounts\Enums\CommandEntry;
use App\Actors\Contracts\CurrentActorSetter;
use App\Agents\Drivers\Commands\FailDriverSwitchStart\FailDriverSwitchStartCommand;
use App\Agents\Drivers\Contracts\DriverCatalogue;
use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Enums\DriverSwitchStage;
use App\Agents\Drivers\Enums\DriverType;
use App\Bus\Contracts\JournalCommands;
use App\Models\Agents\AgentSession;
use App\Models\Drivers\DriverSwitch;
use App\Sessions\StartSessions;
use App\Support\ActorReference;
use App\Values\ChosenAccount;
use App\Values\DriverSwitchTarget;
use Illuminate\Support\Str;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * A replacement start the journal could not make fails the switch with its reason.
 */
#[TestsCommand(FailDriverSwitchStartCommand::class)]
final class FailDriverSwitchStartTest extends TestCase
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
            ActorReference::forUser(TestIds::of(1)),
            new OwnerAuthority('test'),
        );
        $agent = $this->journal->idleAgent('Main agent', 'main-agent')->agentCalled('Main agent');
        $this->session = $this->app->make(StartSessions::class)
            ->start($agent, TestSelections::of('claude-code'), TestSelections::requestId())
            ->session;
    }

    public function test_a_refused_replacement_start_fails_the_switch_with_its_reason(): void
    {
        $switch = $this->startedSwitch();

        $this->failStart($switch, 'refused');

        $this->assertSame(DriverSwitchStage::StartFailed, $switch->refresh()->stage);
    }

    private function startedSwitch(): DriverSwitch
    {
        $switch = $this->switch();
        $switch->markPreflighted();
        $switch->beginStopping(null);
        $switch->markStopped();
        $switch->beginStarting(strtolower((string) Str::ulid()));

        return $switch;
    }

    private function failStart(DriverSwitch $switch, string $reason): void
    {
        $this->app->make(JournalCommands::class)->runAsJournal(
            CommandEntry::HostControl,
            'driver switch',
            new FailDriverSwitchStartCommand($switch->id, $reason),
        );
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
