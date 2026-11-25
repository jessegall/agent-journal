<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Commands\Agents\StartProfileMain\StartProfileMainCommand;
use App\Commands\Profiles\ActivateProfiles\ActivateProfilesCommand;
use App\Contracts\Accounts\AccountUses;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Sessions\ProfileResolver;
use App\Enums\Agents\ConversationModeType;
use App\Enums\Drivers\DriverCapability;
use App\Enums\Drivers\DriverSourceType;
use App\Enums\Drivers\DriverType;
use App\Enums\Profiles\ModelTier;
use App\Enums\Sessions\ResumeRefusal;
use App\Enums\Sessions\StartPreflightRefusal;
use App\Exceptions\DriverCapabilityUnsupported;
use App\Exceptions\ProfileCannotCoordinate;
use App\Exceptions\ResumeRefused;
use App\Exceptions\StartPreflightRefused;
use App\Models\Accounts\Account;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\Drivers\DriverConversation;
use App\Models\Projects\Host;
use App\Models\Sessions\SessionRequest;
use App\Support\AgentSessions;
use App\Support\Capabilities\CodexTerminalCapabilities;
use App\Support\DefaultDrivers;
use App\Support\PolicyOverride;
use App\Support\ProposedProfile;
use App\Support\StartReceipt;
use App\Values\AccountLabel;
use App\Values\ChosenAccount;
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
 * The owner starts a profile's main agent: the default resolves to the profile's model and revision, a preferred driver
 * still lets a start choose another, a helper profile cannot start a main, a later activation leaves an accepted start
 * as it was, an explicit start runs the chosen account and driver type, an automatic codex start on the terminal default
 * and a start the host cannot run are refused before a session, and an explicit resume continues the chosen thread.
 */
#[TestsCommand(StartProfileMainCommand::class)]
final class StartProfileMainTest extends TestCase
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

    public function test_default_resolves_to_the_profiles_model_and_revision(): void
    {
        $this->activate(self::main(ModelTier::Inventive, DefaultDrivers::CLAUDE_CODE));
        $revision = $this->currentRevision();

        $receipt = $this->start('default', null);

        $this->assertSame('opus', $receipt->selection->model);
        $this->assertSame(DefaultDrivers::CLAUDE_CODE, $receipt->selection->driver);
        $source = $receipt->selection->source;
        $this->assertSame(DriverSourceType::Profile, $source->driverSource);
        $this->assertSame('journal-main', $source->profileKey);
        $this->assertSame($revision, $source->profileRevision);
    }

    public function test_a_preferred_driver_still_lets_a_start_choose_another(): void
    {
        $this->activate(self::main(ModelTier::Inventive, DefaultDrivers::CLAUDE_CODE));

        $receipt = $this->start('default', 'codex', driverType: DriverType::Headless);

        $session = AgentSession::query()->findOrFail($receipt->sessionId);
        $this->assertSame([DefaultDrivers::CODEX, 'gpt-6.2-sol'], [$session->driver_key, $session->model]);
    }

    public function test_a_helper_profile_cannot_start_a_main(): void
    {
        $this->activate(TestProposals::profile('journal-main', ProfileBase::readOnlyHelper()));

        $this->expectException(ProfileCannotCoordinate::class);

        $this->start('default', null);
    }

    public function test_a_later_activation_leaves_an_accepted_start_as_it_was(): void
    {
        $this->activate(self::main(ModelTier::Inventive, DefaultDrivers::CLAUDE_CODE));
        $revision = $this->currentRevision();
        $receipt = $this->start('default', null);

        $this->activate(self::main(ModelTier::General, DefaultDrivers::CODEX));

        $session = AgentSession::query()->findOrFail($receipt->sessionId);

        $this->assertSame($revision, $session->profile_revision);
        $this->assertSame('opus', $session->model);
        $this->assertSame(DefaultDrivers::CLAUDE_CODE, $session->driver_key);
    }

    public function test_an_explicit_start_runs_the_chosen_account_and_driver_type_and_the_next_automatic_one_the_defaults(): void
    {
        $this->activate(self::main(ModelTier::Inventive, DefaultDrivers::CLAUDE_CODE));
        $chosen = Account::create(DefaultDrivers::CODEX, AccountLabel::from('Account B'), '/journal/accounts/b');
        $requestId = strtolower((string) Str::ulid());

        $explicit = $this->start('default', 'codex', $requestId, DriverType::Headless, $chosen);
        $repeated = $this->start('default', 'codex', $requestId, DriverType::Headless, $chosen);
        $this->main = $this->journal->idleAgent('Second main', 'main-agent')->agentCalled('Second main');
        $automatic = $this->start('default', 'claude-code');

        $this->assertSame([$explicit->sessionId, false], [$repeated->sessionId, $repeated->isNewSession]);
        $this->assertSame(
            [DefaultDrivers::CODEX, DriverType::Headless, true, $chosen->id],
            $this->recorded($explicit->requestId, $explicit->sessionId),
        );
        $this->assertSame(
            [DefaultDrivers::CLAUDE_CODE, DriverType::Terminal, false, $this->accounts['claude-code']->id],
            $this->recorded($automatic->requestId, $automatic->sessionId),
        );
    }

    public function test_an_automatic_codex_start_on_the_terminal_default_is_refused_with_its_reason(): void
    {
        $this->activate(self::main(ModelTier::Inventive, DefaultDrivers::CLAUDE_CODE));

        $this->assertThrows(
            fn () => $this->start('default', 'codex'),
            DriverCapabilityUnsupported::class,
            DriverCapabilityUnsupported::for(DriverCapability::Run, CodexTerminalCapabilities::NOT_PROVEN)->getMessage(),
        );
    }

    public function test_a_start_the_host_cannot_run_is_refused_before_a_session(): void
    {
        $this->activate(self::main(ModelTier::Inventive, DefaultDrivers::CLAUDE_CODE));
        Host::query()->update(['descriptors' => []]);
        $sessions = AgentSession::query()->count();

        try {
            $this->start('default', null);
            $this->fail('A start no host declared was admitted.');
        } catch (StartPreflightRefused $refused) {
            $this->assertSame(StartPreflightRefusal::CombinationNotDeclared, $refused->refusal);
        }

        $this->assertSame($sessions, AgentSession::query()->count());
    }

    public function test_an_explicit_resume_continues_the_chosen_older_thread_and_a_foreign_one_is_refused(): void
    {
        $this->activate(self::main(ModelTier::Inventive, DefaultDrivers::CLAUDE_CODE));
        $first = AgentSession::query()->findOrFail($this->start('default', null)->sessionId);
        $older = DriverConversation::create($first, 'settings', 'older-thread-0001', null);
        DriverConversation::create($first, 'settings', 'newer-thread-0002', null);
        $this->endSession($first);

        $resumed = $this->resume($older->id);

        $record = SessionRequest::query()->where('request_id', $resumed->requestId)->sole();
        $this->assertSame(
            ['older-thread-0001', ConversationModeType::Resume],
            [$record->conversation_target, $record->conversation_mode],
        );
        $this->assertTrue(SessionRequest::isConversationRequired($resumed->sessionId));

        try {
            $this->resume(strtolower((string) Str::ulid()));
            $this->fail('A conversation that does not exist was resumed.');
        } catch (ResumeRefused $refused) {
            $this->assertSame(ResumeRefusal::ConversationMissing, $refused->refusal);
        }
    }

    private function resume(string $conversationId): StartReceipt
    {
        return $this->app->make(CommandBus::class)->run(new StartProfileMainCommand(
            strtolower((string) Str::ulid()),
            $this->main->id,
            ProfileKey::from('journal-main'),
            ModelSelection::fromInput('default'),
            null,
            conversationId: $conversationId,
        ));
    }

    private function endSession(AgentSession $session): void
    {
        $this->app->make(AgentSessions::class)->end($session);
        $this->main->fenceRuntimes();
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

        return [$record->family, $record->driver_type, $record->account_chosen, $account->id];
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

    /**
     * The revision the main profile is at now; rows another test committed may have numbered it past one.
     */
    private function currentRevision(): int
    {
        return $this->app->make(ProfileResolver::class)->snapshotFor(ProfileKey::from('journal-main'))->revision;
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
