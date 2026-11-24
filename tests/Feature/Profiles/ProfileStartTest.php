<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Commands\ActivateProfiles\ActivateProfilesCommand;
use App\Commands\StartProfileMain\StartProfileMainCommand;
use App\Commands\SwitchAgentDriver\SwitchAgentDriverCommand;
use App\Contracts\Accounts\AccountUses;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Drivers\DriverCatalogue;
use App\Contracts\Sessions\ProfileResolver;
use App\Enums\ModelTier;
use App\Enums\ConversationModeType;
use App\Enums\DriverCapability;
use App\Enums\DriverSourceType;
use App\Enums\DriverSwitchStage;
use App\Enums\DriverType;
use App\Enums\ResumeRefusal;
use App\Enums\StartPreflightRefusal;
use App\Events\DriverSwitchStopped;
use App\Exceptions\DriverCapabilityUnsupported;
use App\Exceptions\DriverSwitchStale;
use App\Exceptions\ProfileCannotCoordinate;
use App\Exceptions\ResumeRefused;
use App\Exceptions\StartPreflightRefused;
use App\Listeners\StartSwitchReplacementOnStop;
use App\Models\Accounts\Account;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Drivers\DriverConversation;
use App\Models\Drivers\DriverSwitch;
use App\Models\Projects\Host;
use App\Models\Starts\StartRecord;
use App\Support\AgentSessions;
use App\Support\Capabilities\CodexTerminalCapabilities;
use App\Support\DefaultDrivers;
use App\Support\PolicyOverride;
use App\Support\ProposedProfile;
use App\Support\StartReceipt;
use App\Values\AccountLabel;
use App\Values\ChosenAccount;
use App\Values\DriverSwitchReceipt;
use App\Values\DriverSwitchTarget;
use App\Values\ModelSelection;
use App\Values\ProfileBase;
use App\Values\ProfileKey;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Illuminate\Support\Str;
use Tests\Fixtures\Profiles\TestProposals;
use Tests\Support\Agents\HasContainerSupport;
use Tests\Support\Agents\ServesEveryCombination;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsAgentRequests;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A main start from a profile: its default model and revision become the start's selection, a pinned driver
 * refuses another, a helper profile cannot start a main, and a later activation leaves an accepted start as it was.
 */
final class ProfileStartTest extends TestCase
{
    use HasContainerSupport;
    use RefreshHookDatabase;
    use ServesEveryCombination;
    use StartsAgentRequests;
    use WithActiveAccount;

    private Agent $main;

    /**
     * @var array<string, Account>
     */
    private array $accounts;

    private User $owner;

    protected function setUp(): void
    {
        parent::setUp();

        $this->accounts = $this->chooseActiveAccounts();
        $this->serveEveryCombination();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->startUserRequestAs($this->owner->id);
        $this->main = Agent::create('Main', 'main-agent');
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

        $receipt = $this->start('default', 'codex');

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
        $this->main = Agent::create('Second main', 'main-agent');
        $automatic = $this->start('default', 'claude-code');

        $this->assertSame([$explicit->sessionId, false], [$repeated->sessionId, $repeated->newSession]);
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

    public function test_a_switch_the_host_cannot_run_is_refused_and_keeps_the_old_session_and_a_repeat_answers_it(): void
    {
        $this->activate(self::main(ModelTier::Inventive, DefaultDrivers::CLAUDE_CODE));
        $old = $this->start('default', null);
        Host::query()->update(['descriptors' => []]);
        $requestId = strtolower((string) Str::ulid());

        $refused = $this->switchTo($requestId, $old->sessionId, $this->accounts['codex']);
        $repeated = $this->switchTo($requestId, $old->sessionId, $this->accounts['codex']);

        $this->assertSame(DriverSwitchStage::Refused, $refused->stage);
        $this->assertSame(StartPreflightRefusal::CombinationNotDeclared->value, $refused->failureReason);
        $this->assertSame($refused->switchId, $repeated->switchId);
        $this->assertSame($old->sessionId, $this->main->refresh()->current_session_id);
    }

    public function test_a_repeated_switch_makes_one_switch_and_its_stage_is_read_back(): void
    {
        $this->activate(self::main(ModelTier::Inventive, DefaultDrivers::CLAUDE_CODE));
        $old = $this->start('default', null);
        Host::query()->update(['descriptors' => []]);
        $codex = $this->accounts['codex'];
        $switch = [
            'requestId' => strtolower((string) Str::ulid()),
            'agentId' => $this->main->id,
            'expectedSessionId' => $old->sessionId,
            'expectedGeneration' => self::generationOf($old->sessionId),
            'driver' => DefaultDrivers::CODEX,
            'driverType' => DriverType::Headless->value,
            'accountId' => $codex->id,
            'accountRevision' => $codex->sign_in_generation,
            'model' => 'default',
        ];

        $this->actingAs($this->owner)->from('/')->post(route('profiles.switch', 'journal-main'), $switch)
            ->assertRedirect('/');
        $this->actingAs($this->owner)->from('/')->post(route('profiles.switch', 'journal-main'), $switch)
            ->assertRedirect('/');

        $made = DriverSwitch::query()->where('request_id', $switch['requestId'])->sole();
        $this->actingAs($this->owner)->getJson(route('profiles.switch-stage', $switch['requestId']))
            ->assertJsonPath('switchId', $made->id)
            ->assertJsonPath('stage', DriverSwitchStage::Refused->value);
    }

    public function test_an_explicit_resume_continues_the_chosen_older_thread_and_a_foreign_one_is_refused(): void
    {
        $this->activate(self::main(ModelTier::Inventive, DefaultDrivers::CLAUDE_CODE));
        $first = AgentSession::query()->findOrFail($this->start('default', null)->sessionId);
        $older = DriverConversation::create($first, 'settings', 'older-thread-0001', null);
        DriverConversation::create($first, 'settings', 'newer-thread-0002', null);
        $this->endSession($first);

        $resumed = $this->resume($older->id);

        $record = StartRecord::query()->where('request_id', $resumed->requestId)->sole();
        $this->assertSame(['older-thread-0001', ConversationModeType::Resume], [$record->conversation_target, $record->conversation_mode]);
        $this->assertTrue(StartRecord::requiresConversation($resumed->sessionId));

        try {
            $this->resume(strtolower((string) Str::ulid()));
            $this->fail('A conversation that does not exist was resumed.');
        } catch (ResumeRefused $refused) {
            $this->assertSame(ResumeRefusal::ConversationMissing, $refused->refusal);
        }
    }

    public function test_a_switch_that_expects_another_session_is_stale(): void
    {
        $this->activate(self::main(ModelTier::Inventive, DefaultDrivers::CLAUDE_CODE));
        $this->start('default', null);

        $this->expectException(DriverSwitchStale::class);

        $this->switchTo(strtolower((string) Str::ulid()), strtolower((string) Str::ulid()), $this->accounts['codex']);
    }

    public function test_a_switch_to_the_codex_terminal_is_refused_with_its_reason_before_any_switch_exists(): void
    {
        $this->activate(self::main(ModelTier::Inventive, DefaultDrivers::CLAUDE_CODE));
        $session = $this->start('default', null)->sessionId;

        $this->assertThrows(
            fn () => $this->switchTo(
                strtolower((string) Str::ulid()),
                $session,
                $this->accounts['codex'],
                DriverType::Terminal,
            ),
            DriverCapabilityUnsupported::class,
            DriverCapabilityUnsupported::for(DriverCapability::Run, CodexTerminalCapabilities::NOT_PROVEN)->getMessage(),
        );
        $this->assertSame(0, DriverSwitch::query()->count());
    }

    public function test_a_switch_keeps_the_registration_its_target_was_pinned_to(): void
    {
        $this->activate(self::main(ModelTier::Inventive, DefaultDrivers::CLAUDE_CODE));
        $session = $this->start('default', null)->sessionId;
        $requestId = strtolower((string) Str::ulid());

        $this->switchTo($requestId, $session, $this->accounts['codex']);

        $switch = DriverSwitch::query()->where('request_id', $requestId)->sole();
        $pin = $this->app->make(DriverCatalogue::class)->pinned(DefaultDrivers::CODEX, DriverType::Headless);
        $this->assertSame(
            [(string) $pin->registration->key, $pin->registration->family],
            [$switch->target_driver_key, $switch->target_family],
        );
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
        $this->assertSame(DriverSwitchStage::LaunchFailed, $failed->refresh()->stage);
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

    /**
     * The process generation the page shows for the session, 0 with no runtime, which a switch names to prove it is
     * current.
     */
    private static function generationOf(string $sessionId): int
    {
        $runtime = AgentRuntime::ofSession($sessionId);

        return $runtime === null ? 0 : $runtime->process_generation;
    }

    private function switchTo(
        string $requestId,
        string $sessionId,
        Account $account,
        DriverType $mode = DriverType::Headless,
    ): DriverSwitchReceipt {
        return $this->app->make(CommandBus::class)->run(new SwitchAgentDriverCommand(
            $requestId,
            $this->main->id,
            ProfileKey::from('journal-main'),
            $sessionId,
            self::generationOf($sessionId),
            new DriverSwitchTarget(
                DefaultDrivers::CODEX,
                $mode,
                new ChosenAccount($account->id, $account->sign_in_generation),
                null,
                false,
            ),
            ModelSelection::fromInput('default'),
        ));
    }

    /**
     * A switch whose old session is proven stopped, as the stop report leaves it; each on an agent of its own.
     */
    private function stoppedSwitch(ChosenAccount $account): DriverSwitch
    {
        $this->main = Agent::create('Switched main '.Str::random(4), 'journal-main');
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
        $record = StartRecord::query()->where('request_id', $requestId)->sole();
        $account = $this->app->make(AccountUses::class)->accountOf($sessionId, Account::LINK_TYPE);

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
