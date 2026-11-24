<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Commands\RetireAgent\RetireAgentCommand;
use App\Commands\StartAgent\StartAgentCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Drivers\DriverCatalogue;
use App\Contracts\Sessions\StartHeartbeats;
use App\Contracts\Time\ServerClock;
use App\Enums\ConversationModeType;
use App\Enums\DriverOperation;
use App\Enums\DriverType;
use App\Enums\ProcessStartState;
use App\Enums\SessionStatus;
use App\Enums\StartDisposition;
use App\Enums\StartOriginType;
use App\Enums\StartUnavailableReason;
use App\Events\StartAccepted;
use App\Exceptions\AccountUnavailable;
use App\Exceptions\AgentBusy;
use App\Exceptions\HostUnavailable;
use App\Exceptions\StartPreviewStale;
use App\Exceptions\StartRefused;
use App\Models\Accounts\Account;
use App\Models\Accounts\ActiveAccount;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Drivers\DriverRequest;
use App\Models\Projects\Host;
use App\Models\Starts\CapacityReservation;
use App\Models\Starts\ProcessStart;
use App\Models\Starts\StartRecord;
use App\Resolvers\Support\PendingStartSecrets;
use App\Support\StartReceipt;
use App\Values\StartPolicy;
use App\Values\StartRequest;
use Carbon\CarbonImmutable;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\Agents\ServesEveryCombination;
use Tests\Support\FixedServerClock;
use Tests\Support\HasResearcherAgent;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsOwnerRequest;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * Every Core start runs StartAgentCommand: one session per request id, refused for a retired or busy agent, and a receipt
 * that never carries the start token, which only the host's own read gives.
 */
final class StartAgentTest extends TestCase
{
    use HasResearcherAgent;
    use RefreshHookDatabase;
    use ServesEveryCombination;
    use StartsOwnerRequest;
    use WithActiveAccount;

    protected function setUp(): void
    {
        parent::setUp();

        $this->chooseActiveAccounts();
        $this->serveEveryCombination();
    }

    public function test_a_session_without_a_selection_cannot_be_written(): void
    {
        $this->expectException(QueryException::class);

        DB::table('agent_sessions')->insert(
            [
                'id' => (string) Str::ulid(),
                'agent_id' => $this->agent->id,
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
            [$again->sessionId, $first->newSession, $again->newSession],
        );
        $this->assertSame(1, AgentSession::query()->where('agent_id', $this->agent->id)->count());
        $this->assertSame(
            StartDisposition::Started,
            StartRecord::query()->where('request_id', $request->requestId)->sole()->disposition,
        );
        $this->assertSame(['--model', TestSelections::MODEL], $first->driverArguments);
        $this->assertSame(StartReceipt::ACTUAL_MODEL_NOT_REPORTED, $first->actualModel);
    }

    public function test_a_retired_agent_is_refused_and_a_busy_agent_refuses_a_second_start(): void
    {
        $this->start($this->request());

        $this->assertThrows(fn () => $this->start($this->request()), AgentBusy::class);

        $this->app->make(CommandBus::class)->run(new RetireAgentCommand($this->agent->id));

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
            $this->agent->id,
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

        $start = ProcessStart::query()->withoutGlobalScopes()->sole();
        $account = Account::query()->withoutGlobalScopes()->where('account_protocol', 'claude-code')->sole();
        $session = AgentSession::query()->findOrFail($receipt->sessionId);
        $this->assertSame(
            [$receipt->sessionId, $account->id, 1],
            [$start->session_id, $start->account_id, $start->account_generation],
        );
        $this->assertSame(ProcessStartState::Pending, $start->state);
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

        $this->assertSame(0, ProcessStart::query()->withoutGlobalScopes()->count());
        $this->assertSame(0, AgentSession::query()->where('agent_id', $this->agent->id)->count());
    }

    public function test_a_main_start_opens_its_runtime_on_the_host_that_runs_it_and_wakes_it_there(): void
    {
        $host = Host::query()->sole();

        $receipt = $this->start($this->request());

        $runtime = AgentRuntime::ofSession($receipt->sessionId);
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
        $this->assertSame(0, AgentSession::query()->where('agent_id', $this->agent->id)->count());
    }

    public function test_a_start_no_host_took_up_within_the_presence_window_ends_and_the_agent_can_start_again(): void
    {
        $receipt = $this->start($this->request());
        $this->app->instance(ServerClock::class, new FixedServerClock(CarbonImmutable::now()->addSeconds(121)));

        $this->app->make(StartHeartbeats::class)->markSilentStarts();

        $session = AgentSession::query()->findOrFail($receipt->sessionId);
        $start = ProcessStart::query()->withoutGlobalScopes()->where('session_id', $receipt->sessionId)->sole();
        $this->assertSame(
            [SessionStatus::Ended, ProcessStartState::Cancelled, false],
            [$session->status, $start->state, CapacityReservation::isHeldFor($session->start_request_id)],
        );
        $this->assertNotSame($receipt->sessionId, $this->start($this->request())->sessionId);
    }

    public function test_a_start_a_host_took_up_stays_running_when_it_falls_silent(): void
    {
        $receipt = $this->start($this->request());
        ProcessStart::query()->withoutGlobalScopes()->where('session_id', $receipt->sessionId)->sole()->claim();
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
        $this->assertSame(0, StartRecord::query()->count());
    }

    private function request(int|null $previewRevision = null): StartRequest
    {
        return new StartRequest(
            TestSelections::requestId(),
            $this->agent->id,
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

    private function start(StartRequest $request): StartReceipt
    {
        return $this->app->make(CommandBus::class)->run(new StartAgentCommand($request));
    }
}
