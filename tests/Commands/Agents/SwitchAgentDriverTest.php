<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Commands\Agents\StartProfileMain\StartProfileMainCommand;
use App\Commands\Agents\SwitchAgentDriver\SwitchAgentDriverCommand;
use App\Commands\Profiles\ActivateProfiles\ActivateProfilesCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Drivers\DriverCatalogue;
use App\Enums\Drivers\DriverCapability;
use App\Enums\Drivers\DriverSwitchStage;
use App\Enums\Drivers\DriverType;
use App\Enums\Profiles\ModelTier;
use App\Enums\Sessions\StartPreflightRefusal;
use App\Exceptions\DriverCapabilityUnsupported;
use App\Exceptions\DriverSwitchStale;
use App\Models\Access\User;
use App\Models\Accounts\Account;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverSwitch;
use App\Models\Projects\Host;
use App\Support\Access\AccessSettings;
use App\Support\Capabilities\CodexTerminalCapabilities;
use App\Support\DefaultDrivers;
use App\Support\PolicyOverride;
use App\Support\ProposedProfile;
use App\Support\StartReceipt;
use App\Values\ChosenAccount;
use App\Values\DriverSwitchReceipt;
use App\Values\DriverSwitchTarget;
use App\Values\ModelSelection;
use App\Values\ProfileBase;
use App\Values\ProfileKey;
use Illuminate\Support\Str;
use Tests\Fixtures\Profiles\TestProposals;
use Tests\Support\Agents\HasContainerSupport;
use Tests\Support\Agents\ServesEveryCombination;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * The owner switches an agent's driver: a switch the host cannot run is refused and keeps the old session, a repeated
 * switch makes one switch whose stage is read back, a switch expecting another session is stale, a switch to the codex
 * terminal is refused before any switch exists, and a switch keeps the registration its target was pinned to.
 */
final class SwitchAgentDriverTest extends TestCase
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

    private User $owner;

    protected function setUp(): void
    {
        parent::setUp();

        $this->accounts = $this->chooseActiveAccounts();
        $this->serveEveryCombination();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->journal->actAsUserId($this->owner->id);
        $this->main = Agent::create('Main', 'main-agent', $this->localProject());
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

    /**
     * The process generation the page shows for the session, 0 with no runtime, which a switch names to prove it is
     * current.
     */
    private static function generationOf(string $sessionId): int
    {
        $runtime = AgentRuntime::findForSession($sessionId);

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
