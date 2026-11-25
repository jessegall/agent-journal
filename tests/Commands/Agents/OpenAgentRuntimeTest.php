<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Commands\Agents\DeliverAgent\DeliverAgentCommand;
use App\Commands\Agents\OpenAgentRuntime\OpenAgentRuntimeCommand;
use App\Commands\Profiles\ActivateProfiles\ActivateProfilesCommand;
use App\Commands\Projects\EnrollHost\EnrollHostCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Drivers\DriverCatalogue as DriverCatalogueContract;
use App\Contracts\Hosts\DockerImageVerifier;
use App\Enums\Drivers\DriverCapability;
use App\Enums\Drivers\DriverOperation;
use App\Enums\Drivers\DriverType;
use App\Enums\Drivers\RequestProgress;
use App\Enums\Projects\ArrangementType;
use App\Enums\Sessions\SessionStatus;
use App\Events\Sessions\SessionOpened;
use App\Exceptions\AccountWriterTaken;
use App\Exceptions\DriverCapabilityUnsupported;
use App\Exceptions\DriverNotContainable;
use App\Exceptions\HostArrangementRefused;
use App\Exceptions\SkillSelectionConflict;
use App\Listeners\AdmitStartSkills;
use App\Models\Accounts\Account;
use App\Models\Accounts\ActiveAccount;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Drivers\DriverRequest;
use App\Models\Projects\Host;
use App\Models\Sessions\SessionPolicy;
use App\Models\Sessions\SessionProcess;
use App\Support\ActorContext;
use App\Support\ArrangementSetting;
use App\Support\Capabilities\CodexHeadlessCapabilities;
use App\Support\Capabilities\CodexTerminalCapabilities;
use App\Support\DefaultDrivers;
use App\Support\DomainRegistry;
use App\Support\DriverCatalogue;
use App\Support\EnrolledHost;
use App\Support\OpenedRuntime;
use App\Values\AccountLabel;
use App\Values\DriverFamily;
use App\Values\DriverKey;
use App\Values\DriverRegistration;
use App\Values\OwnerAuthority;
use App\Values\ProfileBase;
use App\Values\ProviderKey;
use Illuminate\Support\Str;
use Tests\Fixtures\Agents\CountingImageVerifier;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Fixtures\Drivers\AcmeReaderCapabilities;
use Tests\Fixtures\Drivers\RunsAloneCapabilities;
use Tests\Fixtures\Profiles\TestProposals;
use Tests\Support\Agents\HasContainerSupport;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\Skills\PublishesSkills;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * Opening a runtime records its first delivery, and a folder outside the host's roots is refused.
 */
final class OpenAgentRuntimeTest extends TestCase
{
    use CommitsHookRows;
    use HasContainerSupport;
    use OpensLedgerRuntimes;
    use PublishesSkills;
    use WithActiveAccount;

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'hosts',
        'agent_runtimes',
        'driver_requests',
        'driver_turns',
        'accounts',
        'active_accounts',
        'session_processes',
        'links',
        'command_receipts',
        'session_policies',
        'skill_publications',
        'skill_generations',
        'profile_revisions',
        'profiles',
    ];

    public function test_opening_a_runtime_records_its_first_delivery(): void
    {
        [, $opened] = $this->openRuntime(firstMessage: 'Start with the plan.');

        $runtime = AgentRuntime::query()->findOrFail($opened->runtimeId);
        $this->assertSame($opened->sessionId, $runtime->agent_session_id);
        $this->assertSame(
            DriverOperation::Deliver,
            DriverRequest::query()->findOrFail($opened->firstRequestId)->operation,
        );
    }

    public function test_a_folder_outside_the_hosts_roots_is_refused(): void
    {
        $host = $this->enrollHost();

        $this->expectExceptionMessage('/elsewhere');

        $this->asOwner(
            new OpenAgentRuntimeCommand(
                $this->agent()->id,
                $host->hostId,
                '/elsewhere',
                'claude-code',
                '2.1.323',
                'claude',
                DriverType::Headless,
                'claude-opus-5-5',
            ),
        );
    }

    public function test_an_opened_runtime_keeps_the_driver_it_was_pinned_to(): void
    {
        [, $opened] = $this->openRuntime();

        $runtime = AgentRuntime::query()->findOrFail($opened->runtimeId);

        $this->assertSame(
            ['claude-code-headless', 'claude-code', 'Claude Code headless', '2.1.323'],
            [$runtime->driver_key, $runtime->family, $runtime->driver_label, $runtime->driver_build],
        );
        $this->assertSame($runtime->driver_label, AgentSession::query()->findOrFail($opened->sessionId)->driver_label);
    }

    public function test_only_a_runtime_whose_driver_can_be_watched_has_a_screen(): void
    {
        [, $headless] = $this->openRuntime();
        [, $terminal] = $this->openRuntime(driverType: DriverType::Terminal);

        $this->assertSame(
            [false, true],
            [
                AgentRuntime::query()->findOrFail($headless->runtimeId)->hasScreen(),
                AgentRuntime::query()->findOrFail($terminal->runtimeId)->hasScreen(),
            ],
        );
    }

    public function test_a_codex_terminal_start_is_refused_before_anything_is_accepted(): void
    {
        $runtimes = AgentRuntime::query()->count();

        $this->assertThrows(
            fn () => $this->openRuntime(driver: 'codex', driverType: DriverType::Terminal),
            DriverCapabilityUnsupported::class,
            DriverCapabilityUnsupported::for(DriverCapability::Run, CodexTerminalCapabilities::NOT_PROVEN)->getMessage(),
        );
        $this->assertSame($runtimes, AgentRuntime::query()->count());
    }

    public function test_an_opened_runtime_freezes_its_agents_profile_policy(): void
    {
        [, $opened] = $this->openRuntime();

        $policy = SessionPolicy::query()->where('session_id', $opened->sessionId)->sole();

        $this->assertSame(ProfileBase::mainAgent()->key, $policy->profile_key);
        $this->assertNotNull($policy->profile_revision);
    }

    public function test_by_default_the_journal_is_local_and_a_local_host_starts_as_before(): void
    {
        $this->app->instance(DockerImageVerifier::class, new CountingImageVerifier());

        $this->assertSame(ArrangementType::Local, $this->app->make(ArrangementSetting::class)->arrangement);
        $this->assertNotSame('', $this->openOn(ArrangementType::Local)->runtimeId);
    }

    public function test_a_contained_journal_refuses_a_local_host_and_creates_no_start(): void
    {
        $this->app->instance(DockerImageVerifier::class, new CountingImageVerifier());

        $this->useArrangement(ArrangementType::Contained);
        $starts = SessionProcess::query()->withoutGlobalScopes()->count();

        try {
            $this->openOn(ArrangementType::Local);
            $this->fail('A local host started in a contained journal.');
        } catch (HostArrangementRefused $refusal) {
            $this->assertSame(HostArrangementRefused::localHost()->getMessage(), $refusal->getMessage());
        }

        $this->assertSame($starts, SessionProcess::query()->withoutGlobalScopes()->count());
    }

    public function test_a_contained_journal_starts_on_a_contained_host(): void
    {
        $this->app->instance(DockerImageVerifier::class, new CountingImageVerifier());

        $this->useArrangement(ArrangementType::Contained);

        $this->assertNotSame('', $this->openOn(ArrangementType::Contained)->runtimeId);
    }

    public function test_a_local_journal_refuses_a_contained_host(): void
    {
        $this->app->instance(DockerImageVerifier::class, new CountingImageVerifier());

        $this->expectExceptionObject(HostArrangementRefused::containedHost());

        $this->openOn(ArrangementType::Contained);
    }

    public function test_a_contained_codex_start_is_refused_whatever_its_sign_in_and_creates_no_start(): void
    {
        $this->app->instance(DockerImageVerifier::class, new CountingImageVerifier());

        $this->useArrangement(ArrangementType::Contained);

        try {
            $this->openOn(ArrangementType::Contained, 'codex');
            $this->fail('a contained Codex start was not refused');
        } catch (DriverNotContainable $refusal) {
            $this->assertSame(CodexHeadlessCapabilities::NOT_CONTAINABLE, $refusal->getMessage());
        }

        $this->assertSame(0, SessionProcess::query()->count());
        $this->assertNotSame('', $this->openOn(ArrangementType::Contained)->runtimeId);
    }

    public function test_a_local_codex_start_is_not_refused_by_the_container_check(): void
    {
        $this->app->instance(DockerImageVerifier::class, new CountingImageVerifier());

        $this->assertNotSame('', $this->openOn(ArrangementType::Local, 'codex')->runtimeId);
    }

    public function test_a_required_skill_outside_the_selection_refuses_the_start_with_its_key(): void
    {
        $this->journal->installProfiles();

        $this->activateReviewer(['journal-plans']);
        $session = $this->sessionRow(
            Agent::create('Reviewer', 'read-only-helper', $this->localProject()),
            'claude-code',
            1,
        );

        $this->expectException(SkillSelectionConflict::class);
        $this->expectExceptionMessage('journal-plans');

        $this->started($session);
    }

    public function test_a_driver_that_runs_alone_is_refused_on_an_account_in_use(): void
    {
        $this->registerFamily();
        ActiveAccount::findLockedFor('example')->select(
            Account::create('example', AccountLabel::from('Shared account'), '/journal/accounts/example'),
        );

        $host = $this->enrollHost();
        $writer = $this->open($host, DriverType::Headless);

        $refused = $this->assertThrowsAccountWriterTaken(fn () => $this->open($host, DriverType::Terminal));

        $this->assertSame($writer->sessionId, $refused->ownerSessionId);
    }

    public function test_nothing_starts_on_an_account_a_driver_runs_alone_on(): void
    {
        $this->registerFamily();
        ActiveAccount::findLockedFor('example')->select(
            Account::create('example', AccountLabel::from('Shared account'), '/journal/accounts/example'),
        );

        $host = $this->enrollHost();
        $alone = $this->open($host, DriverType::Terminal);

        $refused = $this->assertThrowsAccountWriterTaken(fn () => $this->open($host, DriverType::Headless));

        $this->assertSame($alone->sessionId, $refused->ownerSessionId);
    }

    public function test_an_unfamiliar_registration_delivers_a_turn_and_returns_its_outcome(): void
    {
        $key = 'example/echo-'.str_repeat('a', DriverKey::CHARACTER_LIMIT - strlen('example/echo-'));
        $this->register($key);
        ActiveAccount::findLockedFor('example')->select(
            Account::create('example', AccountLabel::from('Echo account'), '/journal/accounts/example'),
        );
        $host = $this->enrollHost();
        $agent = $this->agent();

        $opened = $this->asOwner(new OpenAgentRuntimeCommand(
            $agent->id,
            $host->hostId,
            self::FOLDER,
            'example',
            '1.0.0',
            'echo',
            DriverType::Headless,
            'echo-small',
        ));
        $receipt = $this->asOwner(DeliverAgentCommand::text($agent->id, $opened->sessionId, 'echo-1', 'Say hello'));
        $claimed = collect(
            $this->journal->hostCall(
                $host,
                'POST',
                '/host/claim?limit=10&wait=0&watched_version=0',
            )->assertOk()->json('requests'),
        )
            ->firstOrFail(fn (array $request) => $request['requestId'] === $receipt->requestId);
        $this->journal->hostCall($host, 'POST', '/host/reports/request', [
            'request_id' => $receipt->requestId,
            'attempt' => $claimed['attempt'],
            'progress' => 'applied',
            'actual_binding' => null,
            'session_id' => $claimed['sessionId'],
            'session_process_id' => $claimed['sessionProcessId'],
            'process_generation' => $claimed['processGeneration'],
        ])->assertSuccessful();

        $this->assertSame(
            [$key, 'Echo', 'Say hello', RequestProgress::Applied],
            [
                AgentRuntime::query()->findOrFail($opened->runtimeId)->driver_key,
                AgentRuntime::query()->findOrFail($opened->runtimeId)->driver_label,
                $claimed['parts'][0]['text'],
                DriverRequest::query()->findOrFail($receipt->requestId)->progress,
            ],
        );
    }

    private function openOn(ArrangementType $arrangement, string $driver = 'claude-code'): OpenedRuntime
    {
        $host = $this->journal->asSystem(
            new EnrollHostCommand('test host '.Str::random(6), [self::FOLDER], $arrangement),
        );
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser('owner'), new OwnerAuthority('test'));
        $agent = Agent::create('Started agent '.Str::random(6), 'main-agent', $this->localProject());
        [$build, $profile, $model] = $driver === 'codex'
            ? ['0.165.0', 'codex', 'gpt-5.5']
            : ['2.1.323', 'claude', 'claude-opus-5-5'];

        return $this->app->make(CommandBus::class)->run(new OpenAgentRuntimeCommand(
            $agent->id,
            $host->hostId,
            self::FOLDER,
            $driver,
            $build,
            $profile,
            DriverType::Headless,
            $model,
        ));
    }

    private function useArrangement(ArrangementType $arrangement): void
    {
        $this->app->instance(
            ArrangementSetting::class,
            ArrangementSetting::fromConfig($arrangement->value, 'journal', '{}'),
        );
    }

    /**
     * @param  list<string>  $requiredSkills
     */
    private function activateReviewer(array $requiredSkills): void
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser('owner'), new OwnerAuthority('test'));
        $this->app->make(CommandBus::class)->run(new ActivateProfilesCommand(TestProposals::of(
            TestProposals::profile(
                'journal-reviewer',
                ProfileBase::readOnlyHelper(),
                'Review.',
                requiredSkills: $requiredSkills,
            ),
        )));
    }

    private function sessionRow(Agent $agent, string $driver, int|null $profileRevision): AgentSession
    {
        $session = new AgentSession()->forceFill([
            ...TestSelections::sessionColumns(),
            'driver_key' => $driver,
            'profile_key' => $profileRevision === null ? 'main-agent' : 'journal-reviewer',
            'profile_revision' => $profileRevision ?? 1,
        ]);
        $session->agent_id = $agent->id;
        $session->status = SessionStatus::Active;
        $session->save();

        return $session;
    }

    private function started(AgentSession $session): void
    {
        $this->app->make(AdmitStartSkills::class)->handle(
            new SessionOpened($session->agent_id, $session->id),
        );
    }

    /**
     * Every installed domain, since the skills this test names come from them.
     */
    protected static function bootedDomains(): array
    {
        return DomainRegistry::installedClasses(dirname(__DIR__, 3));
    }

    private function registerFamily(): void
    {
        $registry = $this->app->make(DriverCatalogueContract::class);
        $this->assertInstanceOf(DriverCatalogue::class, $registry);
        $headless = $registry->forKey(DriverKey::from('claude-code-headless'))->descriptor();
        $claude = $registry->family(DefaultDrivers::CLAUDE_CODE);
        $registry->registerFamily(
            new DriverFamily(
                'example',
                'Example',
                ProviderKey::from('example'),
                'echo',
                $claude->isolatesHooksPerSession,
                [],
            ),
        );

        foreach ([
            ['example/echo-headless', DriverType::Headless, AcmeReaderCapabilities::class],
            ['example/echo-terminal', DriverType::Terminal, RunsAloneCapabilities::class],
        ] as [$key, $driverType, $capabilities]) {
            $registry->register(new DriverRegistration(
                DriverKey::from($key),
                'example',
                $driverType,
                'Echo',
                [],
                $headless->hookProtocol,
                $headless->accountProtocol,
                $headless->skillProtocol,
                $capabilities,
                [],
            ));
        }
    }

    private function open(EnrolledHost $host, DriverType $driverType): OpenedRuntime
    {
        return $this->asOwner(new OpenAgentRuntimeCommand(
            $this->agent()->id,
            $host->hostId,
            self::FOLDER,
            'example',
            '1.0.0',
            'echo',
            $driverType,
            'echo-small',
        ));
    }

    /**
     * @param  callable(): mixed  $start
     */
    private function assertThrowsAccountWriterTaken(callable $start): AccountWriterTaken
    {
        try {
            $start();
        } catch (AccountWriterTaken $refused) {
            return $refused;
        }

        $this->fail('The second writer on the account was not refused.');
    }

    private function register(string $key): void
    {
        $registry = $this->app->make(DriverCatalogueContract::class);
        $this->assertInstanceOf(DriverCatalogue::class, $registry);
        $headless = $registry->forKey(DriverKey::from('claude-code-headless'))->descriptor();
        $claude = $registry->family(DefaultDrivers::CLAUDE_CODE);
        $registry->registerFamily(
            new DriverFamily(
                'example',
                'Example',
                ProviderKey::from('example'),
                'echo',
                $claude->isolatesHooksPerSession,
                [],
            ),
        );
        $registry->register(new DriverRegistration(
            DriverKey::from($key),
            'example',
            DriverType::Headless,
            'Echo',
            [],
            $headless->hookProtocol,
            $headless->accountProtocol,
            $headless->skillProtocol,
            AcmeReaderCapabilities::class,
            [],
        ));
    }
}
