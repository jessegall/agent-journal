<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Agents\Contracts\AccountUses;
use App\Agents\Enums\ArrangementType;
use App\Agents\Enums\DriverSourceType;
use App\Agents\Enums\DriverVariant;
use App\Agents\Enums\ExecutionModeType;
use App\Agents\Enums\HostProtocolVersion;
use App\Agents\Enums\StartPreflightRefusal;
use App\Agents\Exceptions\DriverConflict;
use App\Agents\Exceptions\StartPreflightRefused;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Agents\Models\Host;
use App\Agents\Models\StartRecord;
use App\Agents\Support\StartReceipt;
use App\Agents\Values\ChosenAccount;
use App\Agents\Values\HostCombination;
use App\Agents\Values\ModelSelection;
use App\Bus\Contracts\CommandBus;
use App\Drivers\Enums\HookDriver;
use App\Hooks\Support\DriverCompatibility;
use App\Profiles\Commands\ActivateProfiles;
use App\Profiles\Commands\StartProfileMain;
use App\Profiles\Contracts\ProfileResolver;
use App\Profiles\Exceptions\ProfileCannotCoordinate;
use App\Profiles\Models\Account;
use App\Profiles\Support\PolicyOverride;
use App\Profiles\Support\ProposedProfile;
use App\Profiles\Values\AccountLabel;
use App\Profiles\Values\ProfileBase;
use App\Profiles\Values\ProfileKey;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Illuminate\Support\Str;
use Tests\Fixtures\Profiles\TestProposals;
use Tests\Support\Agents\HasContainerSupport;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsAgentRequests;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A main start from a profile: its default model and revision become the start's selection, a pinned program
 * refuses another, a helper profile cannot start a main, and a later activation leaves an accepted start as it was.
 */
final class ProfileStartTest extends TestCase
{
    use HasContainerSupport;
    use RefreshHookDatabase;
    use StartsAgentRequests;
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

        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->startUserRequestAs($owner->id);
        $this->main = Agent::create('Main', 'main-agent');
    }

    public function test_default_resolves_to_the_profiles_model_and_revision(): void
    {
        $this->activate(self::main('opus', HookDriver::ClaudeCode, false));
        $revision = $this->currentRevision();

        $receipt = $this->start('default', null);

        $this->assertSame('opus', $receipt->selection->model);
        $this->assertSame(HookDriver::ClaudeCode, $receipt->selection->driver);
        $source = $receipt->selection->source;
        $this->assertSame(DriverSourceType::Profile, $source->driverSource);
        $this->assertSame('journal-main', $source->profileKey);
        $this->assertSame($revision, $source->profileRevision);
    }

    public function test_a_pinned_program_refuses_another(): void
    {
        $this->activate(self::main('opus', HookDriver::ClaudeCode, true));

        $this->expectException(DriverConflict::class);

        $this->start('default', 'codex');
    }

    public function test_a_helper_profile_cannot_start_a_main(): void
    {
        $this->activate(TestProposals::profile('journal-main', ProfileBase::readOnlyHelper()));

        $this->expectException(ProfileCannotCoordinate::class);

        $this->start('default', null);
    }

    public function test_a_later_activation_leaves_an_accepted_start_as_it_was(): void
    {
        $this->activate(self::main('opus', HookDriver::ClaudeCode, false));
        $revision = $this->currentRevision();
        $receipt = $this->start('default', null);

        $this->activate(self::main('sonnet', HookDriver::Codex, true));

        $session = AgentSession::query()->findOrFail($receipt->sessionId);

        $this->assertSame($revision, $session->profile_revision);
        $this->assertSame('opus', $session->model);
        $this->assertSame(HookDriver::ClaudeCode->value, $session->driver);
    }

    public function test_an_explicit_start_runs_the_chosen_account_and_variant_and_the_next_automatic_one_the_defaults(): void
    {
        $this->activate(self::main('opus', HookDriver::ClaudeCode, false));
        $chosen = Account::create(HookDriver::Codex, AccountLabel::from('Account B'), '/journal/accounts/b');
        $requestId = strtolower((string) Str::ulid());

        $explicit = $this->start('default', 'codex', $requestId, DriverVariant::Headless, $chosen);
        $repeated = $this->start('default', 'codex', $requestId, DriverVariant::Headless, $chosen);
        $this->main = Agent::create('Second main', 'main-agent');
        $automatic = $this->start('default', 'codex');

        $this->assertSame([$explicit->sessionId, false], [$repeated->sessionId, $repeated->newSession]);
        $this->assertSame(
            [HookDriver::Codex->value, DriverVariant::Headless, true, $chosen->id],
            $this->recorded($explicit),
        );
        $this->assertSame(
            [HookDriver::Codex->value, DriverVariant::Terminal, false, $this->accounts['codex']->id],
            $this->recorded($automatic),
        );
    }

    public function test_a_start_the_host_cannot_run_is_refused_before_a_session(): void
    {
        $this->activate(self::main('opus', HookDriver::ClaudeCode, false));
        Host::query()->update(['combinations' => []]);
        $sessions = AgentSession::query()->count();

        try {
            $this->start('default', null);
            $this->fail('A start no host declared was admitted.');
        } catch (StartPreflightRefused $refused) {
            $this->assertSame(StartPreflightRefusal::CombinationNotDeclared, $refused->refusal);
        }

        $this->assertSame($sessions, AgentSession::query()->count());
    }

    /**
     * The driver, variant, whether the owner chose the account, and the account the start runs with.
     *
     * @return array{string, DriverVariant, bool, string}
     */
    private function recorded(StartReceipt $receipt): array
    {
        $record = StartRecord::query()->where('request_id', $receipt->requestId)->sole();
        $account = $this->app->make(AccountUses::class)->accountOf($receipt->sessionId, Account::LINK_TYPE);

        return [$record->driver, $record->variant, $record->account_chosen, $account->id];
    }

    /**
     * A local host of this protocol that declared every driver and variant on the protected host.
     */
    private function serveEveryCombination(): void
    {
        $host = Host::create('local host', 'secret', [base_path()], ArrangementType::Local);
        $combinations = [];

        foreach (HookDriver::cases() as $driver) {
            foreach (DriverVariant::cases() as $variant) {
                $combinations[] = new HostCombination(
                    $driver,
                    DriverCompatibility::pinned($driver)->version,
                    ArrangementType::Local,
                    ExecutionModeType::ProtectedHost,
                    $variant,
                )->stored();
            }
        }

        $host->recordCombinations(HostProtocolVersion::current()->value, $combinations);
    }

    private static function main(string $model, HookDriver $driver, bool $pinned): ProposedProfile
    {
        return new ProposedProfile(
            ProfileKey::from('journal-main'),
            'Main',
            ProfileBase::mainAgent(),
            'Lead the work.',
            $model,
            $driver,
            $pinned,
            ['opus', 'sonnet'],
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
        $this->app->make(CommandBus::class)->run(new ActivateProfiles(TestProposals::of($profile)));
    }

    private function start(
        string $model,
        string|null $driver,
        string|null $requestId = null,
        DriverVariant|null $variant = null,
        Account|null $chosen = null,
    ): StartReceipt {
        $start = new StartProfileMain(
            $requestId ?? strtolower((string) Str::ulid()),
            $this->main->id,
            ProfileKey::from('journal-main'),
            ModelSelection::fromInput($model),
            $driver,
            $variant,
            false,
            $chosen === null ? null : new ChosenAccount($chosen->id, $chosen->sign_in_generation),
        );

        return $this->app->make(CommandBus::class)->run($start);
    }
}
