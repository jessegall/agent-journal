<?php

declare(strict_types=1);

namespace Tests\Commands\Drivers;

use App\Commands\Drivers\FailDriverSwitchStart\FailDriverSwitchStartCommand;
use App\Commands\Drivers\RetryDriverSwitch\RetryDriverSwitchCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Bus\JournalCommands;
use App\Contracts\Drivers\DriverCatalogue;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Drivers\DriverSwitchStage;
use App\Enums\Drivers\DriverType;
use App\Exceptions\DriverSwitchStageRefused;
use App\Models\Agents\AgentSession;
use App\Models\Drivers\DriverSwitch;
use App\Support\ActorIdentity;
use App\Support\DefaultDrivers;
use App\Support\StartSessions;
use App\Values\ChosenAccount;
use App\Values\DriverSwitchTarget;
use App\Values\OwnerAuthority;
use Illuminate\Support\Str;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * The owner retries a switch whose start failed, which starts the replacement again under the same request; with no
 * host connected that start fails anew, naming why. A switch whose start has not failed is refused.
 */
#[TestsCommand(RetryDriverSwitchCommand::class)]
final class RetryDriverSwitchTest extends TestCase
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
            ActorIdentity::forUser(TestIds::of(1)),
            new OwnerAuthority('test'),
        );
        $agent = $this->journal->idleAgent('Main agent', 'main-agent')->agentCalled('Main agent');
        $this->session = $this->app->make(StartSessions::class)
            ->start($agent, TestSelections::of('claude-code'), TestSelections::requestId())
            ->session;
    }

    public function test_a_retry_starts_the_replacement_again_under_the_same_request(): void
    {
        $switch = $this->startedSwitch();
        $this->failStart($switch, 'refused');
        $requestId = $switch->refresh()->request_id;

        $this->app->make(CommandBus::class)->run(new RetryDriverSwitchCommand($switch->id));

        $switch->refresh();
        $this->assertSame(
            [DriverSwitchStage::StartFailed, $requestId, null, 'No connected host runs agents in this place.'],
            [$switch->stage, $switch->request_id, $switch->replacement_session_id, $switch->failure_reason],
        );
    }

    public function test_a_switch_whose_start_has_not_failed_is_refused(): void
    {
        $switch = $this->startedSwitch();

        $this->assertThrows(
            fn () => $this->app->make(CommandBus::class)->run(new RetryDriverSwitchCommand($switch->id)),
            DriverSwitchStageRefused::class,
        );
        $this->assertSame(DriverSwitchStage::Starting, $switch->refresh()->stage);
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
