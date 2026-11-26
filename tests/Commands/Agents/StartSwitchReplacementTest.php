<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Agents\Drivers\DefaultDrivers;
use App\Commands\Agents\StartProfileMain\StartProfileMainCommand;
use App\Commands\Agents\StartSwitchReplacement\StartSwitchReplacementCommand;
use App\Commands\Profiles\ActivateProfiles\ActivateProfilesCommand;
use App\Contracts\Accounts\AccountUses;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Drivers\DriverCatalogue;
use App\Enums\Drivers\DriverSwitchStage;
use App\Enums\Drivers\DriverType;
use App\Enums\Profiles\ModelTier;
use App\Events\Sessions\DriverSwitchStopped;
use App\Listeners\StartSwitchReplacementOnStop;
use App\Models\Accounts\Account;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\Drivers\DriverSwitch;
use App\Models\Sessions\SessionRequest;
use App\Support\AgentSessions;
use App\Support\PolicyOverride;
use App\Support\ProposedProfile;
use App\Support\StartReceipt;
use App\Values\ChosenAccount;
use App\Values\DriverSwitchTarget;
use App\Values\ModelSelection;
use App\Values\ProfileBase;
use App\Values\ProfileKey;
use Illuminate\Support\Str;
use Tests\Fixtures\Profiles\TestProposals;
use Tests\Support\Agents\HasContainerSupport;
use Tests\Support\Agents\ServesEveryCombination;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * After a proven stop the replacement starts, and a refused one fails the switch.
 */
#[TestsCommand(StartSwitchReplacementCommand::class)]
final class StartSwitchReplacementTest extends TestCase
{
    use HasContainerSupport;
    use RefreshHookDatabase;
    use ServesEveryCombination;
    use WithActiveAccount;

    private Agent $main;

    /**
     * @var array<string, Account>
     */
    private array $accounts;

    protected function setUp(): void
    {
        parent::setUp();

        $this->accounts = $this->chooseActiveAccounts();
        $this->serveEveryCombination();

        $this->journal->owner();
        $this->journal->actAsUserId($this->journal->ownerUser()->id);
        $this->main = $this->journal->idleAgent('Main', 'main-agent')->agentCalled('Main');
    }

    public function test_after_a_proven_stop_the_replacement_starts_and_a_refused_one_fails_the_switch(): void
    {
        $this->activate(self::main(ModelTier::Inventive, DefaultDrivers::CLAUDE_CODE));
        $codex = $this->accounts['codex'];

        $started = $this->stoppedSwitch(new ChosenAccount($codex->id, $codex->sign_in_generation));
        $this->replace($started);
        $failed = $this->stoppedSwitch(new ChosenAccount($codex->id, $codex->sign_in_generation + 1));
        $this->replace($failed);

        $started->refresh();
        $this->assertSame(DriverSwitchStage::Starting, $started->stage);
        $this->assertNotSame($started->expected_session_id, $started->replacement_session_id);
        $this->assertSame(
            [DefaultDrivers::CODEX, DriverType::Headless, true, $codex->id],
            $this->recorded($started->request_id, (string) $started->replacement_session_id),
        );
        $this->assertSame(DriverSwitchStage::StartFailed, $failed->refresh()->stage);
    }

    /**
     * A switch whose old session is proven stopped, as the stop report leaves it; each on an agent of its own.
     */
    private function stoppedSwitch(ChosenAccount $account): DriverSwitch
    {
        $this->main = Agent::create('Switched main '.Str::random(4), 'journal-main', $this->localProject());
        $session = AgentSession::query()->findOrFail($this->start('default', null)->sessionId);
        $this->endSession($session);
        $switch = DriverSwitch::create(
            strtolower((string) Str::ulid()),
            $session,
            0,
            new DriverSwitchTarget(DefaultDrivers::CODEX, DriverType::Headless, $account, null, false),
            $this->app->make(DriverCatalogue::class)->pinned(DefaultDrivers::CODEX, DriverType::Headless),
            'owner',
        );
        $switch->markPreflighted();
        $switch->beginStopping(null);
        $switch->markStopped();

        return $switch;
    }

    private function endSession(AgentSession $session): void
    {
        $this->app->make(AgentSessions::class)->end($session);
        $this->main->fenceRuntimes();
    }

    private function replace(DriverSwitch $switch): void
    {
        $this->app->make(StartSwitchReplacementOnStop::class)->handle(new DriverSwitchStopped($switch->id));
    }

    /**
     * The driver, driver type, whether the owner chose the account, and the account the start runs with.
     *
     * @return array{string, DriverType, bool, string}
     */
    private function recorded(string $requestId, string $sessionId): array
    {
        $record = SessionRequest::query()->where('request_id', $requestId)->sole();
        $account = $this->app->make(AccountUses::class)->accountOf($sessionId, Account::linkType());

        return [
            $record->family,
            $record->driver_type,
            $record->account_chosen,
            $account->id,
        ];
    }

    private static function main(ModelTier $tier, string $preferredDriver): ProposedProfile
    {
        return new ProposedProfile(
            ProfileKey::from('journal-main'),
            'Main',
            ProfileBase::mainAgent(),
            'Lead the work.',
            $tier,
            $preferredDriver,
            null,
            [],
            null,
            PolicyOverride::none(),
            [],
        );
    }

    private function activate(ProposedProfile $profile): void
    {
        $this->app->make(CommandBus::class)->run(new ActivateProfilesCommand(TestProposals::of($profile)));
    }

    private function start(
        string $model,
        string|null $driver,
        string|null $requestId = null,
        DriverType|null $driverType = null,
        Account|null $chosen = null,
    ): StartReceipt {
        $start = new StartProfileMainCommand(
            $requestId ?? strtolower((string) Str::ulid()),
            $this->main->id,
            ProfileKey::from('journal-main'),
            ModelSelection::fromInput($model),
            $driver,
            $driverType,
            false,
            $chosen === null ? null : new ChosenAccount($chosen->id, $chosen->sign_in_generation),
        );

        return $this->app->make(CommandBus::class)->run($start);
    }
}
