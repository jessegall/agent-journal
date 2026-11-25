<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Commands\Agents\StartAgent\StartAgentCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Hosts\DockerImageVerifier;
use App\Contracts\Hosts\HostCapabilities;
use App\Contracts\Sessions\StartRecordResolver;
use App\Enums\Agents\ConversationModeType;
use App\Enums\Agents\ExecutionModeType;
use App\Enums\Drivers\DriverType;
use App\Enums\Projects\CapabilityStatusType;
use App\Enums\Sessions\StartDisposition;
use App\Enums\Sessions\StartOriginType;
use App\Enums\Sessions\StartRefusalType;
use App\Exceptions\CapacityUnavailable;
use App\Exceptions\StartRecordMissing;
use App\Exceptions\StartRefusalReplayed;
use App\Exceptions\StartRequestConflict;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\Sessions\CapacityReservation;
use App\Models\Sessions\SessionRequest;
use App\Support\ActorContext;
use App\Support\ActorIdentity;
use App\Support\HostCapability;
use App\Support\HostCapabilityQuery;
use App\Support\RecordIdentity;
use App\Support\StartReceipt;
use App\Values\ExecutionBudgets;
use App\Values\ExecutionPolicy;
use App\Values\HostCapacity;
use App\Values\StartPolicy;
use App\Values\StartRequest;
use PhpOption\None;
use Tests\Fixtures\Agents\CountingImageVerifier;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A start keeps its intent before admission and its typed refusal after the rollback, on the record under its request
 * id: a replay answers the kept refusal without admitting again, changed input under the key stays refused, an intent
 * interrupted before its receipt resumes once, and the receipt is read by its requester only.
 */
final class StartReceiptTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgentRequests;
    use WithActiveAccount;

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

    private string $ownerId;

    private string $agentId;

    private CountingImageVerifier $images;

    protected function setUp(): void
    {
        parent::setUp();

        $this->chooseActiveAccounts();
        $this->ownerId = User::factory()->create()->id;
        $this->startUserRequestAs($this->ownerId);
        $this->agentId = Agent::create('Builder', 'writing-helper')->id;
        $this->proveTheHost();
    }

    public function test_a_capacity_refusal_keeps_its_receipt_after_the_rollback(): void
    {
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
        $this->app->instance(HostCapacity::class, new HostCapacity(0, 0, 0));
        $request = $this->containerRequest(TestSelections::requestId());
        $this->assertThrows(fn () => $this->start($request), CapacityUnavailable::class);

        $this->assertThrows(
            fn () => $this->start($this->containerRequest($request->requestId, new RecordIdentity('tests.owner', '01m7wgahp0n7766x1e1ta8ehex'))),
            StartRequestConflict::class,
        );
        $this->assertSame(
            StartDisposition::Refused,
            SessionRequest::query()->where('request_id', $request->requestId)->sole()->disposition,
        );
    }

    public function test_an_intent_interrupted_before_its_receipt_resumes_once(): void
    {
        $this->app->instance(HostCapacity::class, new HostCapacity(64, 256 * 1024 ** 3, 1024 ** 4));
        $request = $this->containerRequest(TestSelections::requestId());
        SessionRequest::create($request, TestSelections::pinOf($request), ActorIdentity::of(ActorContext::forUser($this->ownerId)), None::create());

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
        $this->app->instance(HostCapacity::class, new HostCapacity(0, 0, 0));
        $request = $this->containerRequest(TestSelections::requestId());
        $this->assertThrows(fn () => $this->start($request), CapacityUnavailable::class);

        $receipt = $this->app->make(StartRecordResolver::class)->receipt($request->requestId);

        $this->assertSame(
            [StartDisposition::Refused, StartRefusalType::CapacityUnavailable->value, null],
            [$receipt->disposition, $receipt->refusalReason, $receipt->sessionId],
        );
        $this->startRequestAs(Agent::create('Reader', 'writing-helper')->id, TestSelections::requestId());
        $this->assertThrows(
            fn () => $this->app->make(StartRecordResolver::class)->receipt($request->requestId),
            StartRecordMissing::class,
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

    private function start(StartRequest $request): StartReceipt
    {
        return $this->app->make(CommandBus::class)->run(new StartAgentCommand($request));
    }
}
