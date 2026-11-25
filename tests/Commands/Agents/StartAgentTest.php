<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Commands\Agents\RetireAgent\RetireAgentCommand;
use App\Commands\Agents\StartAgent\StartAgentCommand;
use App\Commands\Projects\RecordHostCallFailure\RecordHostCallFailureCommand;
use App\Contracts\Accounts\ActiveAccountReader;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Drivers\DriverCatalogue;
use App\Contracts\Hosts\DockerImageVerifier;
use App\Contracts\Hosts\HostCapabilities;
use App\Contracts\Sessions\SessionRequestResolver;
use App\Contracts\Sessions\StartExecutor;
use App\Contracts\Sessions\StartHeartbeats;
use App\Contracts\Time\ServerClock;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Agents\ConversationModeType;
use App\Enums\Agents\ExecutionModeType;
use App\Enums\Agents\SessionProcessStatus;
use App\Enums\Drivers\DriverOperation;
use App\Enums\Drivers\DriverType;
use App\Enums\Projects\CapabilityStatusType;
use App\Enums\Projects\HostCapabilityType;
use App\Enums\Sessions\SessionStatus;
use App\Enums\Sessions\StartDisposition;
use App\Enums\Sessions\StartOriginType;
use App\Enums\Sessions\StartRefusalType;
use App\Enums\Sessions\StartUnavailableReason;
use App\Events\Sessions\StartAccepted;
use App\Exceptions\AccountContainerUnsupported;
use App\Exceptions\AccountUnavailable;
use App\Exceptions\AgentBusy;
use App\Exceptions\CapacityUnavailable;
use App\Exceptions\ContainerUnavailable;
use App\Exceptions\HostUnavailable;
use App\Exceptions\SessionRequestMissing;
use App\Exceptions\StartPreviewStale;
use App\Exceptions\StartRefusalReplayed;
use App\Exceptions\StartRefused;
use App\Exceptions\StartRequestConflict;
use App\Models\Access\User;
use App\Models\Accounts\Account;
use App\Models\Accounts\ActiveAccount;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Drivers\DriverRequest;
use App\Models\Projects\Host;
use App\Models\Sessions\CapacityReservation;
use App\Models\Sessions\SessionProcess;
use App\Models\Sessions\SessionRequest;
use App\Resolvers\Support\PendingStartSecrets;
use App\Support\Access\AccessSettings;
use App\Support\ActorContext;
use App\Support\ActorIdentity;
use App\Support\ActorStore;
use App\Support\CommandEntrance;
use App\Support\DefaultDrivers;
use App\Support\HostCapability;
use App\Support\HostCapabilityQuery;
use App\Support\RecordIdentity;
use App\Support\StartReceipt;
use App\Values\ExecutionBudgets;
use App\Values\ExecutionPolicy;
use App\Values\HostCapacity;
use App\Values\StartPolicy;
use App\Values\StartRequest;
use Carbon\CarbonImmutable;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use PhpOption\None;
use Tests\Fixtures\Agents\CountingImageVerifier;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\Agents\ServesEveryCombination;
use Tests\Support\CommitsHookRows;
use Tests\Support\FixedServerClock;
use Tests\Support\TestIds;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * Every Core start runs StartAgentCommand: one session per request id, refused for a retired or busy agent, and a receipt
 * that never carries the start token, which only the host's own read gives.
 */
final class StartAgentTest extends TestCase
{
    use CommitsHookRows;
    use ServesEveryCombination;
    use WithActiveAccount;

    private Agent $researcher;

    private const array TABLES = [
        'users',
        'agents',
        'agent_sessions',
        'accounts',
        'active_accounts',
        'session_requests',
        'capacity_reservations',
        'session_processes',
        'session_policies',
        'session_tokens',
        'agent_runtimes',
        'driver_requests',
        'agent_stacks',
        'links',
        'command_receipts',
        'settings_records',
    ];

    private const string IMAGE = 'registry.example/journal-helper@sha256:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

    private CountingImageVerifier $images;

    private string $agentId;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();
        $this->researcher = $this->journal->idleAgent('Researcher', 'read-only-helper')->agentCalled('Researcher');
        $this->agentId = $this->journal->idleAgent('Builder', 'writing-helper')->agentCalled('Builder')->id;

        $this->chooseActiveAccounts();
        $this->serveEveryCombination();
    }

    public function test_a_session_without_a_selection_cannot_be_written(): void
    {
        $this->expectException(QueryException::class);

        DB::table('agent_sessions')->insert(
            [
                'id' => (string) Str::ulid(),
                'agent_id' => $this->researcher->id,
                'driver' => 'claude-code',
                'status' => 'active',
                'profile_key' => 'main-agent',
                'profile_revision' => 1,
            ],
        );
    }

    public function test_repeating_a_request_id_returns_the_same_session(): void
    {
        $request = $this->request();

        $first = $this->start($request);
        $again = $this->start($request);

        $this->assertSame(
            [$first->sessionId, true, false],
            [$again->sessionId, $first->isNewSession, $again->isNewSession],
        );
        $this->assertSame(1, AgentSession::query()->where('agent_id', $this->researcher->id)->count());
        $this->assertSame(
            StartDisposition::Started,
            SessionRequest::query()->where('request_id', $request->requestId)->sole()->disposition,
        );
        $this->assertSame(['--model', TestSelections::MODEL], $first->driverArguments);
        $this->assertSame(StartReceipt::ACTUAL_MODEL_NOT_REPORTED, $first->actualModel);
    }

    public function test_a_retired_agent_is_refused_and_a_busy_agent_refuses_a_second_start(): void
    {
        $this->start($this->request());

        $this->assertThrows(fn () => $this->start($this->request()), AgentBusy::class);

        $this->app->make(CommandBus::class)->run(new RetireAgentCommand($this->researcher->id));

        $this->assertThrows(fn () => $this->start($this->request()), StartRefused::class);
    }

    public function test_the_receipt_holds_no_token_and_the_host_reads_it_once_the_start_is_accepted(): void
    {
        Event::fake([StartAccepted::class]);
        $request = $this->request();

        $receipt = $this->start($request);
        $secrets = $this->app->make(PendingStartSecrets::class)->secrets($request->requestId);

        $this->assertSame($receipt->sessionId, $secrets->sessionId);
        $this->assertStringNotContainsString($secrets->token, serialize($receipt));
        $this->assertStringNotContainsString($secrets->token, json_encode($receipt, JSON_THROW_ON_ERROR));
        Event::assertDispatched(
            StartAccepted::class,
            fn (StartAccepted $accepted): bool => $accepted->sessionId === $receipt->sessionId,
        );
    }

    public function test_a_codex_start_receipt_carries_its_model_flag_and_no_actual_model(): void
    {
        $request = new StartRequest(
            TestSelections::requestId(),
            $this->researcher->id,
            TestSelections::of('codex'),
            StartOriginType::MainStart,
            null,
            null,
            ConversationModeType::New,
            null,
            StartPolicy::withoutProfile(TestSelections::onHost()),
            driverType: DriverType::Headless,
        );

        $receipt = $this->start($request);

        $this->assertSame(
            [['--model', TestSelections::MODEL], StartReceipt::ACTUAL_MODEL_NOT_REPORTED],
            [$receipt->driverArguments, $receipt->actualModel],
        );
    }

    public function test_a_start_runs_with_the_chosen_account_and_registers_its_pending_start(): void
    {
        $receipt = $this->start($this->request());

        $start = SessionProcess::query()->withoutGlobalScopes()->sole();
        $account = Account::query()->withoutGlobalScopes()->where('account_protocol', 'claude-code')->sole();
        $session = AgentSession::query()->findOrFail($receipt->sessionId);
        $this->assertSame(
            [$receipt->sessionId, $account->id, 1],
            [$start->session_id, $start->account_id, $start->account_generation],
        );
        $this->assertSame(SessionProcessStatus::Pending, $start->status);
        $this->assertTrue($session->isLinkedTo($account));
    }

    public function test_without_a_chosen_account_the_start_is_refused_and_keeps_nothing(): void
    {
        ActiveAccount::query()->withoutGlobalScopes()->where('account_protocol', 'claude-code')->sole()->clear();

        try {
            $this->start($this->request());
            $this->fail('A start ran without an account.');
        } catch (AccountUnavailable $refused) {
            $this->assertSame(StartUnavailableReason::NoAccount, $refused->reason);
        }

        $this->assertSame(0, SessionProcess::query()->withoutGlobalScopes()->count());
        $this->assertSame(0, AgentSession::query()->where('agent_id', $this->researcher->id)->count());
    }

    public function test_a_main_start_opens_its_runtime_on_the_host_that_runs_it_and_wakes_it_there(): void
    {
        $host = Host::query()->sole();

        $receipt = $this->start($this->request());

        $runtime = AgentRuntime::findForSession($receipt->sessionId);
        $wake = DriverRequest::query()->where('agent_runtime_id', $runtime?->id)->sole();
        $this->assertSame(
            [$host->id, base_path(), DriverOperation::Wake],
            [$runtime?->host_id, $runtime?->canonical_folder, $wake->operation],
        );
    }

    public function test_a_main_start_with_no_host_to_run_it_is_refused_and_keeps_nothing(): void
    {
        Host::query()->sole()->revokeAt(CarbonImmutable::now());

        $this->assertThrows(fn () => $this->start($this->request()), HostUnavailable::class);
        $this->assertSame(0, AgentSession::query()->where('agent_id', $this->researcher->id)->count());
    }

    public function test_a_start_no_host_took_up_within_the_presence_window_ends_and_the_agent_can_start_again(): void
    {
        $receipt = $this->start($this->request());
        $this->app->instance(ServerClock::class, new FixedServerClock(CarbonImmutable::now()->addSeconds(121)));

        $this->app->make(StartHeartbeats::class)->markSilentStarts();

        $session = AgentSession::query()->findOrFail($receipt->sessionId);
        $start = SessionProcess::query()->withoutGlobalScopes()->where('session_id', $receipt->sessionId)->sole();
        $this->assertSame(
            [SessionStatus::Ended, SessionProcessStatus::Cancelled, false],
            [$session->status, $start->status, CapacityReservation::isHeldFor($session->start_request_id)],
        );
        $this->assertNotSame($receipt->sessionId, $this->start($this->request())->sessionId);
    }

    public function test_a_start_a_host_took_up_stays_running_when_it_falls_silent(): void
    {
        $receipt = $this->start($this->request());
        SessionProcess::query()->withoutGlobalScopes()->where('session_id', $receipt->sessionId)->sole()->claim();
        $this->app->instance(ServerClock::class, new FixedServerClock(CarbonImmutable::now()->addSeconds(121)));

        $this->app->make(StartHeartbeats::class)->markSilentStarts();

        $this->assertSame(SessionStatus::Silent, AgentSession::query()->findOrFail($receipt->sessionId)->status);
    }

    public function test_a_start_previewed_before_the_drivers_changed_is_refused_and_keeps_nothing(): void
    {
        $stale = $this->app->make(DriverCatalogue::class)->revision() - 1;

        $this->assertThrows(
            fn () => $this->start($this->request($stale)),
            StartPreviewStale::class,
        );
        $this->assertSame(0, SessionRequest::query()->count());
    }

    public function test_a_capacity_refusal_keeps_its_receipt_after_the_rollback(): void
    {
        $this->proveTheHost();

        $this->app->instance(HostCapacity::class, new HostCapacity(0, 0, 0));
        $request = $this->containerRequest(TestSelections::requestId());

        $this->assertThrows(fn () => $this->start($request), CapacityUnavailable::class);

        $record = SessionRequest::query()->where('request_id', $request->requestId)->sole();
        $this->assertSame(
            [StartDisposition::Refused, StartRefusalType::CapacityUnavailable->value, null],
            [$record->disposition, $record->refusal_reason, $record->session_id],
        );
        $this->assertNotNull($record->refused_at);
        $this->assertSame(0, AgentSession::query()->where('agent_id', $this->agentId)->count());
        $this->assertSame(0, CapacityReservation::query()->count());
    }

    public function test_a_replay_answers_the_kept_refusal_without_a_second_admission(): void
    {
        $this->proveTheHost();

        $this->app->instance(HostCapacity::class, new HostCapacity(0, 0, 0));
        $request = $this->containerRequest(TestSelections::requestId());
        $this->assertThrows(fn () => $this->start($request), CapacityUnavailable::class);
        $checksAtRefusal = $this->images->checks;
        $this->app->instance(HostCapacity::class, new HostCapacity(64, 256 * 1024 ** 3, 1024 ** 4));

        try {
            $this->start($request);
            $this->fail('A refused start ran again under its request id.');
        } catch (StartRefusalReplayed $replayed) {
            $this->assertSame(StartRefusalType::CapacityUnavailable->value, $replayed->reason);
        }

        $this->assertSame($checksAtRefusal, $this->images->checks);
        $this->assertSame(0, CapacityReservation::query()->count());
        $this->assertSame(0, AgentSession::query()->where('agent_id', $this->agentId)->count());
    }

    public function test_changed_input_under_a_refused_key_is_refused_as_a_conflict(): void
    {
        $this->proveTheHost();

        $this->app->instance(HostCapacity::class, new HostCapacity(0, 0, 0));
        $request = $this->containerRequest(TestSelections::requestId());
        $this->assertThrows(fn () => $this->start($request), CapacityUnavailable::class);

        $this->assertThrows(
            fn () => $this->start(
                $this->containerRequest(
                    $request->requestId,
                    new RecordIdentity('tests.owner', '01m7wgahp0n7766x1e1ta8ehex'),
                ),
            ),
            StartRequestConflict::class,
        );
        $this->assertSame(
            StartDisposition::Refused,
            SessionRequest::query()->where('request_id', $request->requestId)->sole()->disposition,
        );
    }

    public function test_an_intent_interrupted_before_its_receipt_resumes_once(): void
    {
        $this->proveTheHost();

        $this->app->instance(HostCapacity::class, new HostCapacity(64, 256 * 1024 ** 3, 1024 ** 4));
        $request = $this->containerRequest(TestSelections::requestId());
        SessionRequest::create(
            $request,
            TestSelections::pinOf($request),
            ActorIdentity::of(ActorContext::forUser($this->journal->ownerUser()->id)),
            None::create(),
        );

        $resumed = $this->start($request);
        $replayed = $this->start($request);

        $record = SessionRequest::query()->where('request_id', $request->requestId)->sole();
        $this->assertSame(
            [StartDisposition::Started, $resumed->sessionId, $resumed->sessionId, true, false],
            [
                $record->disposition,
                $record->session_id,
                $replayed->sessionId,
                $resumed->isNewSession,
                $replayed->isNewSession,
            ],
        );
        $this->assertSame(1, CapacityReservation::query()->where('start_request_id', $request->requestId)->count());
        $this->assertSame(1, AgentSession::query()->where('agent_id', $this->agentId)->count());
    }

    public function test_the_requester_reads_a_sessionless_refused_receipt_and_another_agent_finds_none(): void
    {
        $this->proveTheHost();

        $this->app->instance(HostCapacity::class, new HostCapacity(0, 0, 0));
        $request = $this->containerRequest(TestSelections::requestId());
        $this->assertThrows(fn () => $this->start($request), CapacityUnavailable::class);

        $receipt = $this->app->make(SessionRequestResolver::class)->receipt($request->requestId);

        $this->assertSame(
            [StartDisposition::Refused, StartRefusalType::CapacityUnavailable->value, null],
            [$receipt->disposition, $receipt->refusalReason, $receipt->sessionId],
        );
        $reader = Agent::create('Reader', 'writing-helper', $this->localProject());
        $this->journal->actAsAgentIds($reader->id, TestSelections::requestId());
        $this->assertThrows(
            fn () => $this->app->make(SessionRequestResolver::class)->receipt($request->requestId),
            SessionRequestMissing::class,
        );
    }

    public function test_unproven_account_transport_refuses_before_account_selection_or_host_preparation(): void
    {
        $this->journal->actAsUserId(TestIds::of(1));
        $this->mock(ActiveAccountReader::class)->shouldNotReceive('forStart');
        $this->mock(StartExecutor::class)->shouldNotReceive('start');
        $this->mock(HostCapabilities::class)->shouldReceive('capability')->andReturnUsing(
            fn (HostCapabilityQuery $query) => new HostCapability(
                $query,
                $query->capability === HostCapabilityType::AccountTransport
                    ? CapabilityStatusType::Unverified : CapabilityStatusType::Supported,
                'Test evidence',
                'Recorded for the test.',
            ),
        );
        $commands = $this->app->make(CommandBus::class);
        $actor = Agent::create('Builder', 'writing-helper', $this->localProject());

        foreach (DefaultDrivers::familyKeys() as $driver) {
            $this->assertThrows(
                fn () => $commands->run(new StartAgentCommand($this->requestFor($actor, $driver))),
                AccountContainerUnsupported::class,
            );
        }
    }

    public function test_a_named_program_and_model_start_the_agent(): void
    {
        $agent = Agent::create('Started by hand', 'read-only-helper', $this->localProject());

        $response = $this->actingAs($this->journal->ownerUser())->postJson(route('agents.start', $agent->id), [
            'requestId' => (string) Str::ulid(),
            'driver' => 'codex',
            'model' => 'gpt-6-luna',
        ]);

        $response->assertOk();
        $response->assertJsonPath('driver', 'codex');
        $response->assertJsonPath('requestedModel', 'gpt-6-luna');
        $this->assertSame(1, AgentSession::query()->where('agent_id', $agent->id)->count());
    }

    public function test_a_missing_program_or_model_or_the_default_model_is_refused_without_a_session(): void
    {
        $agent = Agent::create('Started by hand', 'read-only-helper', $this->localProject());
        $inputs = [['model' => 'gpt-6-luna'], ['driver' => 'codex'], ['driver' => 'codex', 'model' => 'default']];

        foreach ($inputs as $input) {
            $response = $this->actingAs($this->journal->ownerUser())->postJson(
                route('agents.start', $agent->id),
                ['requestId' => (string) Str::ulid(), ...$input],
            );

            $this->assertGreaterThanOrEqual(400, $response->status(), json_encode($input, JSON_THROW_ON_ERROR));
        }

        $this->assertSame(0, AgentSession::query()->where('agent_id', $agent->id)->count());
    }

    public function test_a_host_without_a_proven_container_runtime_refuses_before_reserving(): void
    {
        $this->signIn();
        $this->app->instance(HostCapabilities::class, new class implements HostCapabilities
        {
            public function capability(HostCapabilityQuery $query): HostCapability
            {
                $status = $query->capability === HostCapabilityType::AccountTransport
                    ? CapabilityStatusType::Supported
                    : CapabilityStatusType::Unverified;

                return new HostCapability($query, $status, 'docs/x.md', 'Runtime unavailable.');
            }
        });

        $this->assertThrows(fn () => $this->start($this->newAgentContainerRequest()), ContainerUnavailable::class);

        $this->assertSame(0, CapacityReservation::query()->count());
    }

    public function test_capacity_beyond_the_host_refuses(): void
    {
        $this->signIn();
        $this->app->instance(HostCapabilities::class, new class implements HostCapabilities
        {
            public function capability(HostCapabilityQuery $query): HostCapability
            {
                return new HostCapability(
                    $query,
                    CapabilityStatusType::Supported,
                    'docs/x.md',
                    'Proven for this test.',
                );
            }
        });
        $this->app->instance(DockerImageVerifier::class, new class implements DockerImageVerifier
        {
            public function isVerified(string $imageReference): bool
            {
                return true;
            }
        });
        $this->app->instance(HostCapacity::class, new HostCapacity(3, 16 * 1024 ** 3, 50 * 1024 ** 3));

        $this->start($this->newAgentContainerRequest());

        $this->assertThrows(fn () => $this->start($this->newAgentContainerRequest()), CapacityUnavailable::class);
        $this->assertSame(1, CapacityReservation::query()->count());
        $this->assertSame(1, AgentSession::query()->count());
    }

    private function request(int|null $previewRevision = null): StartRequest
    {
        return new StartRequest(
            TestSelections::requestId(),
            $this->researcher->id,
            TestSelections::of(),
            StartOriginType::MainStart,
            null,
            null,
            ConversationModeType::New,
            null,
            StartPolicy::withoutProfile(TestSelections::onHost()),
            driverType: DriverType::Headless,
            previewRevision: $previewRevision,
        );
    }

    /**
     * The journal answers the host's claim with a server error, as the host's own calls record it.
     */
    private function failCallsOf(string $hostId): void
    {
        $failure = new RecordHostCallFailureCommand($hostId, '/host/claim', 500, 'Maximum execution time exceeded');

        $this->app->make(CommandEntrance::class)->through(
            CommandEntry::HostControl,
            fn () => $this->app->make(ActorStore::class)->actAsSystem(
                'host request',
                fn () => $this->app->make(CommandBus::class)->run($failure),
            ),
        );
    }

    private function start(StartRequest $request): StartReceipt
    {
        return $this->app->make(CommandBus::class)->run(new StartAgentCommand($request));
    }

    private function containerRequest(
        string $requestId,
        RecordIdentity $ownerWork = new RecordIdentity('tests.owner', '01m7wgahp0n7766x1e1ta8ehew'),
    ): StartRequest {
        return new StartRequest(
            $requestId,
            $this->agentId,
            TestSelections::of(),
            StartOriginType::OwnerRequest,
            $ownerWork,
            null,
            ConversationModeType::New,
            null,
            StartPolicy::withoutProfile(new ExecutionPolicy(
                ExecutionModeType::RequiredContainer,
                self::IMAGE,
                'helper-7',
                ExecutionBudgets::defaults(),
                [],
            )),
            driverType: DriverType::Headless,
        );
    }

    private function proveTheHost(): void
    {
        $this->app->instance(HostCapabilities::class, new class implements HostCapabilities
        {
            public function capability(HostCapabilityQuery $query): HostCapability
            {
                return new HostCapability(
                    $query,
                    CapabilityStatusType::Supported,
                    'docs/x.md',
                    'Proven for this test.',
                );
            }
        });
        $this->images = new CountingImageVerifier();
        $this->app->instance(DockerImageVerifier::class, $this->images);
    }

    private function requestFor(Agent $actor, string $driver): StartRequest
    {
        $image = 'registry.example/journal-helper@sha256:'.str_repeat('a', 64);
        $policy = new ExecutionPolicy(
            ExecutionModeType::RequiredContainer,
            $image,
            'helper-7',
            ExecutionBudgets::defaults(),
            [],
        );

        return new StartRequest(
            TestSelections::requestId(),
            $actor->id,
            TestSelections::of($driver),
            StartOriginType::OwnerRequest,
            new RecordIdentity('tests.owner', '01m7wgahp0n7766x1e1ta8ehew'),
            null,
            ConversationModeType::New,
            null,
            StartPolicy::withoutProfile($policy),
            driverType: DriverType::Headless,
        );
    }

    private function newAgentContainerRequest(): StartRequest
    {
        $agent = Agent::create('Builder', 'writing-helper', $this->localProject());

        return new StartRequest(
            TestSelections::requestId(),
            $agent->id,
            TestSelections::of(),
            StartOriginType::OwnerRequest,
            new RecordIdentity('tests.owner', '01m7wgahp0n7766x1e1ta8ehew'),
            null,
            ConversationModeType::New,
            null,
            StartPolicy::withoutProfile($this->policy()),
            driverType: DriverType::Headless,
        );
    }

    private function policy(): ExecutionPolicy
    {
        return new ExecutionPolicy(
            ExecutionModeType::RequiredContainer,
            self::IMAGE,
            'helper-7',
            ExecutionBudgets::defaults(),
            [],
        );
    }

    private function signIn(): void
    {
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->journal->actAsUserId($owner->id);
    }
}
