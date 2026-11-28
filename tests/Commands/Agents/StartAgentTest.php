<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Accounts\Contracts\ActiveAccountReader;
use App\Accounts\Exceptions\AccountUnavailable;
use App\Agents\Commands\RetireAgent\RetireAgentCommand;
use App\Agents\Commands\StartAgent\StartAgentCommand;
use App\Agents\Drivers\Contracts\DriverCatalogue;
use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Enums\DriverOperation;
use App\Agents\Drivers\Enums\DriverType;
use App\Agents\Enums\ConversationModeType;
use App\Agents\Enums\SessionProcessStatus;
use App\Agents\Exceptions\StartPreviewStale;
use App\Agents\Resolvers\Support\PendingStartSecrets;
use App\Bus\Contracts\CommandBus;
use App\Events\Sessions\StartAccepted;
use App\Exceptions\AgentBusy;
use App\Exceptions\HostUnavailable;
use App\Exceptions\StartRefused;
use App\Hosts\Contracts\DockerImageVerifier;
use App\Hosts\Contracts\HostCapabilities;
use App\Hosts\Enums\HostProcessPurpose;
use App\Hosts\HostCapability;
use App\Hosts\HostCapabilityQuery;
use App\Hosts\Protocol\HostProcessReportType;
use App\Models\Accounts\Account;
use App\Models\Accounts\ActiveAccount;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Drivers\DriverRequest;
use App\Models\Hosts\HostProcess;
use App\Models\Projects\Environment;
use App\Models\Projects\Host;
use App\Models\Projects\ProjectBinding;
use App\Models\Sessions\CapacityReservation;
use App\Models\Sessions\SessionPolicy;
use App\Models\Sessions\SessionProcess;
use App\Models\Sessions\SessionRequest;
use App\Projects\Enums\ArrangementType;
use App\Projects\Enums\CapabilityStatusType;
use App\Projects\Enums\HostCapabilityType;
use App\Projects\Exceptions\AccountContainerUnsupported;
use App\Projects\Exceptions\ContainerUnavailable;
use App\Projects\Values\BindingFolder;
use App\Sessions\Contracts\SessionPolicyReader;
use App\Sessions\Contracts\StartHeartbeats;
use App\Sessions\Enums\SessionStatus;
use App\Sessions\Enums\StartDisposition;
use App\Sessions\Enums\StartOriginType;
use App\Sessions\Enums\StartUnavailableReason;
use App\Sessions\Exceptions\CapacityUnavailable;
use App\Sessions\Exceptions\SessionPolicyFrozen;
use App\Sessions\StartHeartbeats as SessionEndings;
use App\Sessions\StartReceipt;
use App\Sessions\Values\HostCapacity;
use App\Sessions\Values\StartPolicy;
use App\Time\Contracts\ServerClock;
use App\Values\PresenceReport;
use App\Values\StartRequest;
use Carbon\CarbonImmutable;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\Agents\StartsAgents;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\FixedServerClock;
use Tests\Support\Hosts\TestHostProcess;
use Tests\TestCase;
use Throwable;

/**
 * Every Core start runs StartAgentCommand: one session per request id, refused for a retired or busy agent, and a receipt
 * that never carries the start token, which only the host's own read gives.
 */
#[TestsCommand(StartAgentCommand::class)]
final class StartAgentTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgents;

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
        'account_notices',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->prepareAgentStarts();
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

        $this->assertSame(StartReceipt::ACTUAL_MODEL_NOT_REPORTED, $receipt->actualModel);
    }

    public function test_a_start_runs_with_the_chosen_account_and_the_journal_takes_it_to_prove_it(): void
    {
        $receipt = $this->start($this->request());

        $start = SessionProcess::query()->withoutGlobalScopes()->sole();
        $account = Account::query()->withoutGlobalScopes()->where('account_protocol', 'claude-code')->sole();
        $session = AgentSession::query()->findOrFail($receipt->sessionId);
        $this->assertSame(
            [$receipt->sessionId, $account->id, 1],
            [$start->session_id, $start->account_id, $start->account_generation],
        );
        $this->assertSame(SessionProcessStatus::Starting, $start->status);
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
        $probe = HostProcess::query()
            ->where('agent_runtime_id', AgentRuntime::findForSession($receipt->sessionId)?->id)
            ->where('purpose', HostProcessPurpose::BuildProbe)
            ->sole();
        $this->journal->nameHostProcess('probe', $probe->id)
            ->hostProcess('probe', fn (TestHostProcess $probe) => $probe->report(HostProcessReportType::Running));
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

    public function test_an_agent_of_a_connected_project_starts_on_its_serving_bindings_host_in_its_folder(): void
    {
        $binding = $this->servingBindingOf('Shop');
        $shopper = $this->journal->idleAgent('Shopper', 'read-only-helper', 'Shop')->agentCalled('Shopper');

        $receipt = $this->start($this->mainStartOf($shopper->id));

        $runtime = AgentRuntime::findForSession($receipt->sessionId);
        $this->assertSame([$binding->host_id, '/Users/owner/shop'], [$runtime?->host_id, $runtime?->canonical_folder]);
    }

    public function test_an_agent_of_a_project_no_folder_serves_is_refused_and_nothing_is_reserved(): void
    {
        $this->journal->project('Shop');
        $shopper = $this->journal->idleAgent('Shopper', 'read-only-helper', 'Shop')->agentCalled('Shopper');

        $this->assertThrows(
            fn () => $this->start($this->mainStartOf($shopper->id)),
            StartRefused::class,
        );

        $this->assertSame(0, CapacityReservation::query()->count());
        $this->assertSame(0, AgentSession::query()->where('agent_id', $shopper->id)->count());
    }

    public function test_unproven_account_transport_refuses_before_account_selection_or_host_preparation(): void
    {
        $this->signIn();
        $this->mock(ActiveAccountReader::class)->shouldNotReceive('forStart');
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

        $refusals = [];

        foreach (DefaultDrivers::familyKeys() as $driver) {
            try {
                $commands->run(new StartAgentCommand($this->requestFor($actor, $driver)));
                $refusals[$driver] = 'started';
            } catch (Throwable $refusal) {
                $refusals[$driver] = $refusal::class.': '.$refusal->getMessage();
            }
        }

        $this->assertSame(
            [
                DefaultDrivers::CLAUDE_CODE => AccountContainerUnsupported::class,
                DefaultDrivers::CODEX => AccountContainerUnsupported::class,
            ],
            array_map(fn (string $refusal) => strstr($refusal.':', ':', true), $refusals),
            json_encode($refusals, JSON_THROW_ON_ERROR),
        );
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
        $this->arrangeRoomForOneContainer();

        $this->start($this->newAgentContainerRequest());

        $this->assertThrows(fn () => $this->start($this->newAgentContainerRequest()), CapacityUnavailable::class);
        $this->assertSame(1, CapacityReservation::query()->count());
        $this->assertSame(1, AgentSession::query()->count());
    }

    public function test_an_ended_session_gives_its_capacity_back_for_the_next_start(): void
    {
        $this->arrangeRoomForOneContainer();
        $this->start($this->newAgentContainerRequest());
        $first = AgentSession::query()->sole();

        $this->journal->service(SessionEndings::class)->markExited($first, 'exit code 0');
        $this->start($this->newAgentContainerRequest());

        $this->assertSame(2, AgentSession::query()->count());
    }

    /**
     * A signed-in owner on a host with room for one agent container, whose capabilities and image are proven.
     */
    private function arrangeRoomForOneContainer(): void
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
    }

    /**
     * A new connected project of that name with one ready binding, in /Users/owner/shop, whose relay declares what
     * the enrolled host declares.
     */
    public function test_a_start_freezes_its_policy_with_its_session(): void
    {
        $request = $this->request();

        $receipt = $this->start($request);

        $frozen = $this->app->make(SessionPolicyReader::class)->policyFor($receipt->sessionId);
        $this->assertSame(1, SessionPolicy::query()->where('session_id', $receipt->sessionId)->count());
        $this->assertSame($request->policy->digest(), $frozen->digest());
    }

    public function test_a_frozen_policy_cannot_change(): void
    {
        $receipt = $this->start($this->request());
        $row = SessionPolicy::query()->where('session_id', $receipt->sessionId)->sole();

        $this->expectException(SessionPolicyFrozen::class);

        $row->profile_key = 'writing-helper';
        $row->save();
    }

    private function servingBindingOf(string $name): ProjectBinding
    {
        $project = $this->journal->project($name)->projectCalled($name);
        $relay = Host::create('laptop', 'secret-'.bin2hex(random_bytes(4)), [], ArrangementType::Local);
        $binding = ProjectBinding::create(
            $relay,
            $project,
            Environment::create($project, "{$name} work"),
            $this->journal->idleAgent("{$name} main", 'main-agent', $name)->agentCalled("{$name} main"),
            new BindingFolder(
                'root-'.bin2hex(random_bytes(4)),
                '/Users/owner/shop',
                'Owner laptop',
                bin2hex(random_bytes(8)),
            ),
        );
        $binding->recordPresence(new PresenceReport('boot-1', 1, '1.0.0', true, false, 0, true));

        return $binding;
    }

    private function mainStartOf(string $agentId): StartRequest
    {
        return new StartRequest(
            TestSelections::requestId(),
            $agentId,
            TestSelections::of(),
            StartOriginType::MainStart,
            null,
            null,
            ConversationModeType::New,
            null,
            StartPolicy::withoutProfile(TestSelections::onHost()),
            driverType: DriverType::Terminal,
        );
    }
}
