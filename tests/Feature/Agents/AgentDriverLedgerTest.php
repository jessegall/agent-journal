<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Commands\CancelDriverRequest\CancelDriverRequestCommand;
use App\Commands\CancelKeyScript\CancelKeyScriptCommand;
use App\Commands\ChangeAgentEffort\ChangeAgentEffortCommand;
use App\Commands\ChangeAgentModel\ChangeAgentModelCommand;
use App\Commands\ClaimDriverRequests\ClaimDriverRequestsCommand;
use App\Commands\ClaimStartGrant\ClaimStartGrantCommand;
use App\Commands\DeliverAgent\DeliverAgentCommand;
use App\Commands\InterruptAgent\InterruptAgentCommand;
use App\Commands\InterruptStuckTurns\InterruptStuckTurnsHandler;
use App\Commands\OpenAgentRuntime\OpenAgentRuntimeCommand;
use App\Commands\PostChatMessage\PostChatMessageCommand;
use App\Commands\RecordRuntime\RecordRuntimeCommand;
use App\Commands\ReleaseAgentHold\ReleaseAgentHoldCommand;
use App\Commands\RepairDriverSettings\RepairDriverSettingsCommand;
use App\Commands\ReportDriverTurn\ReportDriverTurnCommand;
use App\Commands\ReportRequestProgress\ReportRequestProgressCommand;
use App\Commands\ReportRuntimeActivity\ReportRuntimeActivityCommand;
use App\Commands\ReportRuntimeExit\ReportRuntimeExitCommand;
use App\Commands\ReportRuntimeHeartbeat\ReportRuntimeHeartbeatCommand;
use App\Commands\ResolveDriverDelivery\ResolveDriverDeliveryCommand;
use App\Commands\ResumeKeyScript\ResumeKeyScriptCommand;
use App\Commands\RetireAgent\RetireAgentCommand;
use App\Commands\RetryDriverRequest\RetryDriverRequestCommand;
use App\Commands\SendDriverRequestAgain\SendDriverRequestAgainCommand;
use App\Commands\StopAgent\StopAgentCommand;
use App\Commands\WakeAgent\WakeAgentCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Drivers\AttachmentReferences;
use App\Contracts\Drivers\DriverCatalogue;
use App\Contracts\Drivers\MessagePart;
use App\Contracts\Sessions\AgentDirectory;
use App\Contracts\Sessions\RuntimeResolver;
use App\Data\Messages\MessageAttachmentData;
use App\Data\Messages\MessageTextData;
use App\Enums\ArrangementType;
use App\Enums\DriverOperation;
use App\Enums\DriverType;
use App\Enums\ExecutionModeType;
use App\Enums\HoldReason;
use App\Enums\HostRefusal;
use App\Enums\HostWakeRefusal;
use App\Enums\IntervalRole;
use App\Enums\MessageBatchState;
use App\Enums\RecoveryAction;
use App\Enums\RequestOutcome;
use App\Enums\RequestProgress;
use App\Enums\RuntimeActivity;
use App\Enums\SessionStatus;
use App\Events\DriverRequestRecovered;
use App\Events\EngineTicked;
use App\Events\SessionStateChanged;
use App\Exceptions\AccountFolderInvalid;
use App\Exceptions\ActorNotAllowed;
use App\Exceptions\DriverRequestRefused;
use App\Exceptions\HostReportRefused;
use App\Exceptions\KeyScriptRefused;
use App\Exceptions\StaleProcessGeneration;
use App\Exceptions\StopOutdated;
use App\Models\Accounts\Account;
use App\Models\Accounts\ActiveAccount;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Chats\InboxInterval;
use App\Models\Chats\InboxRecord;
use App\Models\Drivers\DriverRequest;
use App\Models\Drivers\DriverTurn;
use App\Models\Drivers\RuntimeEvent;
use App\Models\Messages\MessageBatch;
use App\Models\Projects\Host;
use App\Models\Records\GlobalGroup;
use App\Models\Starts\ProcessStart;
use App\Models\Starts\SessionPolicy;
use App\Support\ActorContext;
use App\Support\ActorIdentity;
use App\Support\AgentStatus;
use App\Support\ArrangementSetting;
use App\Support\ClaimedRequests;
use App\Support\DefaultDrivers;
use App\Support\DriverBudgets;
use App\Support\EnginePass;
use App\Support\EngineTickedDelivery;
use App\Support\EnrolledHost;
use App\Support\HeartbeatService;
use App\Support\InitialWakeSettlement;
use App\Support\LaunchProfiles;
use App\Support\MessageBatchService;
use App\Support\NativeTurns;
use App\Support\OpenedRuntime;
use App\Support\PendingWorkSources;
use App\Support\RequestKey;
use App\Support\StartGrant;
use App\Support\Ticks\ElapsedTime;
use App\Values\AccountLabel;
use App\Values\BrowserInputCapabilities;
use App\Values\DriverReceipt;
use App\Values\ExecutionBudgets;
use App\Values\ExecutionPolicy;
use App\Values\OwnerAuthority;
use App\Values\ProfileBase;
use App\Values\ProfileStartPolicy;
use App\Values\RequestReportBinding;
use App\Values\ScriptProgress;
use App\Values\StartPolicy;
use App\Values\StopConditions;
use Carbon\CarbonImmutable;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use Spatie\LaravelData\Optional;
use Tests\Fixtures\Agents\CountedPendingWork;
use Tests\Support\Agents\HostContract;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\OpensPairChats;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsHostCalls;
use Tests\Support\TestActors;
use Tests\Support\TestStartAuthority;
use Tests\Support\WritesInboxMessages;
use Tests\TestCase;

/**
 * The driver ledger end to end inside the journal: opening a runtime, the six acceptance commands
 * with their ordering and idempotency, the host protocol and its stale-report fences, the runtime reader and the
 * heartbeat bridge. Hosts are driven through their commands; one test goes through the signed host route.
 */
final class AgentDriverLedgerTest extends TestCase
{
    private const int RUNTIMES_PAST_A_BATCH = 10;

    use CommitsHookRows;
    use OpensLedgerRuntimes;
    use OpensPairChats;
    use RunsTrustedCommands;
    use SendsHostCalls;
    use WritesInboxMessages;

    private const string NO_CONTAINER = 'The host cannot provide a container.';

    private const string STOPPING_LABEL = 'Stopping · Waiting for helpers';

    private const string MENU_EVIDENCE = 'menu login-method, stable';

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'start_tokens',
        'agent_stacks',
        'hook_calls',
        'hosts',
        'agent_runtimes',
        'driver_requests',
        'driver_turns',
        'accounts',
        'active_accounts',
        'process_starts',
        'links',
    ];

    private const string FOLDER = '/work/project';

    public function test_a_batch_is_taken_by_the_turn_its_prompt_starts_and_settles_when_that_turn_ends(): void
    {
        [$host, $opened] = $this->openRuntime();
        GlobalGroup::installJournal();
        $inbox = InboxRecord::create('test-chat', (string) str()->ulid());
        $interval = InboxInterval::create($inbox->id, TestActors::agentIdentity(7), IntervalRole::Member, 1);
        $at = CarbonImmutable::now();
        $batch = MessageBatch::create($interval->id, $opened->sessionId, 1, 'thread-1', 1, $at, $at->addHour());

        $this->asSystem(
            new ReportDriverTurnCommand($host->hostId, $opened->runtimeId, 1, 'prompt-1', false, 'opus', 'high', null),
        );
        $turn = DriverTurn::query()->where('agent_runtime_id', $opened->runtimeId)->sole();
        $this->assertSame($turn->id, $batch->refresh()->driver_turn_id);

        $this->asSystem(
            new ReportDriverTurnCommand($host->hostId, $opened->runtimeId, 1, 'prompt-1', true, 'opus', 'high', 'finished'),
        );
        $this->app->make(MessageBatchService::class)->sweep($at->addMinute());

        $this->assertNotSame(MessageBatchState::Dispatched, $batch->refresh()->state);
    }

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

    public function test_a_repeated_key_returns_the_same_request_and_other_content_conflicts(): void
    {
        [, $opened] = $this->openRuntime();

        $first = $this->deliver($opened, 'key-1', 'Hello');
        $again = $this->deliver($opened, 'key-1', 'Hello');

        $this->assertSame($first->requestId, $again->requestId);
        $this->expectException(DriverRequestRefused::class);
        $this->deliver($opened, 'key-1', 'Something else');
    }

    public function test_an_attachment_only_delivery_reaches_the_host_as_its_parts_in_order(): void
    {
        $this->app->scoped(AttachmentReferences::class, fn (): AttachmentReferences => $this->attachmentsExcept('gone'));
        [$host, $opened] = $this->openRuntime();
        $parts = [new MessageAttachmentData('01JNOTES', 'digest-1', 'notes.md'), new MessageTextData('Read it first.')];

        $receipt = $this->asOwner(new DeliverAgentCommand($this->agentIdOf($opened), $opened->sessionId, 'parts', $parts));

        $claimed = $this->claimedScript($host, $receipt->requestId);
        $this->assertSame(array_map(fn (MessagePart $part): array => $part->toArray(), $parts), $claimed['parts']);
    }

    public function test_a_delivery_naming_an_attachment_that_cannot_be_read_is_refused_whole(): void
    {
        $this->app->scoped(AttachmentReferences::class, fn (): AttachmentReferences => $this->attachmentsExcept('gone'));
        [, $opened] = $this->openRuntime();
        $parts = [new MessageTextData('Here it is.'), new MessageAttachmentData('gone', 'digest-1', 'old.md')];

        $this->assertThrows(
            fn () => $this->asOwner(new DeliverAgentCommand($this->agentIdOf($opened), $opened->sessionId, 'mixed', $parts)),
            DriverRequestRefused::class,
            DriverRequestRefused::attachmentMissing('gone')->getMessage(),
        );
        $this->assertSame(0, DriverRequest::query()->where('idempotency_key', 'mixed')->count());
    }

    public function test_a_repeated_delivery_of_the_same_parts_returns_the_same_request(): void
    {
        $this->app->scoped(AttachmentReferences::class, fn (): AttachmentReferences => $this->attachmentsExcept('gone'));
        [, $opened] = $this->openRuntime();
        $parts = [new MessageAttachmentData('01JNOTES', 'digest-1', 'notes.md')];
        $send = fn (): DriverReceipt => $this->asOwner(
            new DeliverAgentCommand($this->agentIdOf($opened), $opened->sessionId, 'same', $parts),
        );

        $this->assertSame($send()->requestId, $send()->requestId);
    }

    public function test_requests_are_numbered_in_the_order_they_were_accepted(): void
    {
        [, $opened] = $this->openRuntime();

        $first = $this->deliver($opened, 'a', 'First');
        $second = $this->deliver($opened, 'b', 'Second');

        $this->assertSame($first->sequence + 1, $second->sequence);
    }

    public function test_a_later_effort_supersedes_an_earlier_one_that_has_not_run(): void
    {
        [, $opened] = $this->openRuntime();

        $high = $this->asOwner(
            new ChangeAgentEffortCommand($this->agentIdOf($opened), $opened->sessionId, 'effort-1', 'high'),
        );
        $this->asOwner(new ChangeAgentEffortCommand($this->agentIdOf($opened), $opened->sessionId, 'effort-2', 'low'));

        $this->assertSame(RequestProgress::Superseded, DriverRequest::query()->findOrFail($high->requestId)->progress);
    }

    /**
     * A setting change the host staged waits for a turn and counts as applied only on that turn's evidence: the model
     * its output names confirms a model change, while an effort change, which no output shows, stays unconfirmed.
     */
    public function test_a_staged_setting_is_applied_only_on_the_turns_evidence(): void
    {
        [$host, $opened] = $this->openRuntime();
        $agentId = $this->agentIdOf($opened);
        $model = $this->asOwner(new ChangeAgentModelCommand($agentId, $opened->sessionId, 'model-1', 'claude-sonnet-5-5'));
        $effort = $this->asOwner(new ChangeAgentEffortCommand($agentId, $opened->sessionId, 'effort-1', 'high'));
        $this->asSystem(new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()));

        foreach ([$model, $effort] as $setting) {
            $this->reportTurnEnd($host, $setting->requestId, null);
        }
        $this->assertSame(RequestProgress::Staged, DriverRequest::query()->findOrFail($model->requestId)->progress);

        foreach ([$model, $effort] as $setting) {
            $this->reportTurnEnd($host, $setting->requestId, ['exit_code' => 0, 'model' => 'claude-sonnet-5-5']);
        }

        $this->assertSame(
            [RequestProgress::Applied, RequestProgress::DeliveryUncertain],
            [
                DriverRequest::query()->findOrFail($model->requestId)->progress,
                DriverRequest::query()->findOrFail($effort->requestId)->progress,
            ],
        );
    }

    public function test_an_unknown_effort_is_refused_before_anything_is_accepted(): void
    {
        [, $opened] = $this->openRuntime();

        try {
            $this->asOwner(new ChangeAgentEffortCommand($this->agentIdOf($opened), $opened->sessionId, 'effort-1', 'extreme'));
            $this->fail('An unknown effort was accepted.');
        } catch (DriverRequestRefused) {
            $this->assertSame(0, DriverRequest::query()->where('operation', DriverOperation::ChangeEffort)->count());
        }
    }

    public function test_repeated_wakes_raise_one_open_wake(): void
    {
        [, $opened] = $this->openRuntime();

        $first = $this->asOwner(new WakeAgentCommand($this->agentIdOf($opened), $opened->sessionId, 'wake-1'));
        $second = $this->asOwner(new WakeAgentCommand($this->agentIdOf($opened), $opened->sessionId, 'wake-2'));

        $this->assertSame($first->requestId, $second->requestId);
        $this->assertSame(1, DriverRequest::query()->where('operation', DriverOperation::Wake)->count());
        $this->assertSame(2, DriverRequest::query()->findOrFail($first->requestId)->wake_requested);
    }

    public function test_session_activity_acknowledges_only_the_claimed_wake_and_a_later_one_stays_pending(): void
    {
        [$host, $opened] = $this->openRuntime();
        $this->asSystem(
            new ReportRuntimeActivityCommand($host->hostId, $opened->runtimeId, RuntimeActivity::Running, HoldReason::None, 1),
        );
        $this->asOwner(new WakeAgentCommand($this->agentIdOf($opened), $opened->sessionId, 'wake-1'));
        $this->asSystem(new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()));
        $this->asOwner(new WakeAgentCommand($this->agentIdOf($opened), $opened->sessionId, 'wake-2'));
        $turns = $this->app->make(NativeTurns::class);

        $turns->acknowledgeWake($opened->sessionId, CarbonImmutable::now()->addSecond());

        $wake = DriverRequest::query()->where('operation', DriverOperation::Wake)->sole();
        $this->assertSame(
            [1, 2, RequestProgress::Accepted],
            [$wake->wake_acknowledged, $wake->wake_requested, $wake->progress],
        );

        $this->asSystem(new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()));
        $turns->acknowledgeWake($opened->sessionId, CarbonImmutable::now()->addSecond());

        $wake->refresh();
        $this->assertSame([2, RequestProgress::Applied], [$wake->wake_acknowledged, $wake->progress]);
        $this->assertNull($wake->outcome);
    }

    public function test_activity_from_before_the_wake_was_taken_acknowledges_nothing(): void
    {
        [$host, $opened] = $this->openRuntime();
        $this->asSystem(
            new ReportRuntimeActivityCommand($host->hostId, $opened->runtimeId, RuntimeActivity::Running, HoldReason::None, 1),
        );
        $this->asOwner(new WakeAgentCommand($this->agentIdOf($opened), $opened->sessionId, 'wake-1'));
        $this->asSystem(new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()));

        $this->app->make(NativeTurns::class)->acknowledgeWake($opened->sessionId, CarbonImmutable::now()->subMinute());

        $wake = DriverRequest::query()->where('operation', DriverOperation::Wake)->sole();
        $this->assertSame([0, RequestProgress::Staged], [$wake->wake_acknowledged, $wake->progress]);
    }

    public function test_a_wake_of_an_idle_session_with_nothing_pending_settles_as_no_work_and_starts_no_turn(): void
    {
        $this->app->make(PendingWorkSources::class)->register(CountedPendingWork::class);
        CountedPendingWork::$count = 0;
        [$host, $opened] = $this->openRuntime();
        $this->asSystem(
            new ReportRuntimeActivityCommand($host->hostId, $opened->runtimeId, RuntimeActivity::Idle, HoldReason::None, 1),
        );
        $this->asOwner(new WakeAgentCommand($this->agentIdOf($opened), $opened->sessionId, 'wake-1'));

        $claimed = $this->asSystem(new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()));

        $wake = DriverRequest::query()->where('operation', DriverOperation::Wake)->sole();
        $this->assertSame([], $claimed->requests);
        $this->assertSame([RequestProgress::Applied, RequestOutcome::NoWork], [$wake->progress, $wake->outcome]);
    }

    public function test_a_wake_of_an_idle_session_with_pending_work_goes_to_the_host(): void
    {
        $this->app->make(PendingWorkSources::class)->register(CountedPendingWork::class);
        CountedPendingWork::$count = 1;
        [$host, $opened] = $this->openRuntime();
        $this->asSystem(
            new ReportRuntimeActivityCommand($host->hostId, $opened->runtimeId, RuntimeActivity::Idle, HoldReason::None, 1),
        );
        $this->asOwner(new WakeAgentCommand($this->agentIdOf($opened), $opened->sessionId, 'wake-1'));

        $claimed = $this->asSystem(new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()));

        $this->assertCount(1, $claimed->requests);
        $this->assertSame(
            RequestProgress::Staged,
            DriverRequest::query()->where('operation', DriverOperation::Wake)->sole()->progress,
        );
        // The journal sends the wake's whole prompt; the host makes none up.
        $this->assertSame('Check your pending journal work.', $claimed->requests[0]->message);
    }

    /**
     * A host that could not start a turn, such as a prompt its screen did not let in, reports it staged and tries no
     * more: the journal takes the request back and offers it again once its wait has passed.
     */
    public function test_a_staged_report_gives_the_request_back_to_be_offered_again_after_a_wait(): void
    {
        [$host, $opened] = $this->openRuntime(firstMessage: 'Behind a menu');
        $this->asSystem(new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()));

        $this->reportProgress($host->hostId, $opened->firstRequestId, RequestProgress::Staged);

        $this->assertSame(RequestProgress::Accepted, DriverRequest::query()->findOrFail($opened->firstRequestId)->progress);
        $tooSoon = $this->asSystem(new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()));
        $this->assertSame([], $tooSoon->requests);

        $this->travel(3)->seconds();
        $again = $this->asSystem(new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()));

        $this->assertSame(
            [$opened->firstRequestId],
            array_map(fn ($request): string => $request->requestId, $again->requests),
        );
    }

    /**
     * The host reports a turn's end as it saw it; the journal judges a result marked an error as a failed turn.
     */
    public function test_a_turn_whose_result_is_an_error_is_judged_failed(): void
    {
        [$host, $opened] = $this->openRuntime(firstMessage: 'Fails');
        $this->asSystem(new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()));
        $request = DriverRequest::query()->findOrFail($opened->firstRequestId);

        $this->hostCall($host, '/host/reports/request', [
            'request_id' => $request->id,
            'attempt' => $request->attempt_version,
            'actual_binding' => null,
            'turn_end' => ['exit_code' => 0, 'result_read' => true, 'result_subtype' => 'error_during_execution'],
        ])->assertSuccessful();

        $this->assertSame(
            [RequestProgress::Failed, RequestOutcome::TurnFailed],
            [$request->fresh()?->progress, $request->fresh()?->outcome],
        );
    }

    /**
     * A turn that runs past the journal's limit is interrupted on the next engine pass, once, and its runtime held.
     */
    public function test_a_turn_running_past_the_limit_is_interrupted_once(): void
    {
        [$host, $opened] = $this->openRuntime(firstMessage: 'Never ends');
        $this->asSystem(new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()));
        $request = DriverRequest::query()->findOrFail($opened->firstRequestId);
        $this->asSystem(new ReportRequestProgressCommand(
            $host->hostId,
            $request->id,
            $request->attempt_version,
            RequestProgress::Applying,
            null,
            null,
        ));

        $this->travel(InterruptStuckTurnsHandler::TURN_MINUTES_LIMIT + 1)->minutes();

        foreach ([1, 2] as $pass) {
            $this->app->make(EnginePass::class)->run(fn () => $this->app->make(EngineTickedDelivery::class)->deliver(
                new EngineTicked(CarbonImmutable::now(), ElapsedTime::between(0, 1_000_000_000)),
            ));
        }

        $this->assertSame(1, DriverRequest::query()->where('operation', DriverOperation::Interrupt)->count());
        $this->assertSame(HoldReason::Interrupted, AgentRuntime::query()->findOrFail($opened->runtimeId)->hold_reason);
    }

    /**
     * The host reports plain facts and the journal chooses the hold: an account that is not signed in, and a stop the
     * host could not prove, each leave the runtime needing attention.
     */
    public function test_the_journal_holds_a_runtime_for_attention_from_the_hosts_facts(): void
    {
        [$host, $signedOut] = $this->openRuntime(firstMessage: 'Signed out');
        $this->asSystem(new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()));
        $wake = DriverRequest::query()->findOrFail($signedOut->firstRequestId);
        $this->asSystem(new ReportRequestProgressCommand(
            $host->hostId,
            $wake->id,
            $wake->attempt_version,
            RequestProgress::Failed,
            null,
            RequestOutcome::Refused,
            refusal: HostWakeRefusal::NotSignedIn,
            noProcessCreated: true,
        ));

        [$stopHost, $stopped] = $this->openRuntime();
        $stop = $this->asOwner(new StopAgentCommand($this->agentIdOf($stopped), $stopped->sessionId, 'stop-1'));
        $this->asSystem(new ClaimDriverRequestsCommand($stopHost->hostId, 10, BrowserInputCapabilities::none()));
        $this->asSystem(new ReportRequestProgressCommand(
            $stopHost->hostId,
            $stop->requestId,
            DriverRequest::query()->findOrFail($stop->requestId)->attempt_version,
            RequestProgress::Failed,
            null,
            RequestOutcome::StopUnconfirmed,
        ));

        $this->assertSame(
            [HoldReason::NeedsAttention, HoldReason::NeedsAttention],
            [
                AgentRuntime::query()->findOrFail($signedOut->runtimeId)->hold_reason,
                AgentRuntime::query()->findOrFail($stopped->runtimeId)->hold_reason,
            ],
        );
    }

    public function test_an_interrupt_holds_the_runtime_at_once(): void
    {
        [, $opened] = $this->openRuntime();

        $this->asOwner(new InterruptAgentCommand($this->agentIdOf($opened), $opened->sessionId, 'interrupt-1'));

        $this->assertSame(HoldReason::Interrupted, AgentRuntime::query()->findOrFail($opened->runtimeId)->hold_reason);
    }

    public function test_a_stopping_runtime_refuses_new_requests(): void
    {
        [, $opened] = $this->openRuntime();
        $this->asOwner(new StopAgentCommand($this->agentIdOf($opened), $opened->sessionId, 'stop-1'));

        $this->expectException(DriverRequestRefused::class);

        $this->deliver($opened, 'after-stop', 'Too late');
    }

    public function test_a_host_claims_only_the_requests_of_its_own_runtimes(): void
    {
        [$host, $opened] = $this->openRuntime(firstMessage: 'Mine');
        [, $foreign] = $this->openRuntime(firstMessage: 'Not mine');

        $claimed = $this->asSystem(new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()));

        $this->assertInstanceOf(ClaimedRequests::class, $claimed);
        $this->assertSame(
            [$opened->firstRequestId],
            array_map(fn ($request): string => $request->requestId, $claimed->requests),
        );
        $this->assertSame(
            RequestProgress::Staged,
            DriverRequest::query()->findOrFail($opened->firstRequestId)->progress,
        );
        $this->assertSame(
            RequestProgress::Accepted,
            DriverRequest::query()->findOrFail($foreign->firstRequestId)->progress,
        );
    }

    /**
     * A host keeps the runtime of every session it ever ran, so a claim reads only those with a request waiting, and
     * more than a page of their requests when they hold that many.
     */
    public function test_a_host_with_more_runtimes_than_a_batch_still_claims_a_batch(): void
    {
        [$host] = $this->openRuntime(firstMessage: 'First');

        for ($more = 0; $more < self::RUNTIMES_PAST_A_BATCH; $more++) {
            $this->asOwner(new OpenAgentRuntimeCommand(
                $this->agent()->id,
                $host->hostId,
                self::FOLDER,
                'claude-code',
                '2.1.323',
                'claude',
                DriverType::Headless,
                'claude-opus-5-5',
                firstMessage: 'Another',
            ));
        }

        $claimed = $this->asSystem(new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()));

        $this->assertCount(10, $claimed->requests);
    }

    public function test_the_start_grant_is_handed_out_once(): void
    {
        [$host, $opened] = $this->openRuntime();

        $first = $this->asSystem(new ClaimStartGrantCommand($host->hostId, $opened->runtimeId));
        $second = $this->asSystem(new ClaimStartGrantCommand($host->hostId, $opened->runtimeId));

        $this->assertInstanceOf(StartGrant::class, $first);
        $this->assertNotSame('', $first->token);
        $this->assertNull($second);
    }

    public function test_the_start_grant_names_the_driver_registration_by_its_key(): void
    {
        [$host, $opened] = $this->openRuntime();
        $runtime = AgentRuntime::query()->findOrFail($opened->runtimeId);

        $grant = $this->asSystem(new ClaimStartGrantCommand($host->hostId, $opened->runtimeId));

        $key = $this->app->make(DriverCatalogue::class)->keyFor($runtime->family, $runtime->driver_type);
        $label = $this->app->make(DriverCatalogue::class)->forKey($key)->descriptor()->label;

        $this->assertSame([(string) $key, (string) $key, $label], [$grant->runtime->driverKey, $runtime->driver_key, $runtime->driver_label]);
    }

    public function test_a_start_grant_of_a_session_on_the_protected_host_carries_no_container(): void
    {
        [$host, $opened] = $this->openRuntime();

        $grant = $this->asSystem(new ClaimStartGrantCommand($host->hostId, $opened->runtimeId));

        $this->assertNull($grant->container);
        $this->assertNull($grant->toArray()['container']);
    }

    public function test_a_contained_main_sessions_grant_carries_its_attachable_container(): void
    {
        $account = Account::create(DefaultDrivers::CLAUDE_CODE, AccountLabel::from('Plain'), '/journal/accounts/01plain');
        ActiveAccount::lockedFor(DefaultDrivers::CLAUDE_CODE)->select($account);
        [$host, $opened] = $this->openRuntime();
        // The driver runs in a terminal of its own, which is what makes a main session's container attachable.
        AgentRuntime::query()->findOrFail($opened->runtimeId)->forceFill(['has_screen' => true])->save();
        $this->app->instance(
            ArrangementSetting::class,
            ArrangementSetting::fromConfig('contained', 'acme', '{"main":{"folder":"main"}}'),
        );
        $image = 'journal-agent@sha256:'.str_repeat('a', 64);
        $execution = ExecutionPolicy::make(
            ExecutionModeType::RequiredContainer,
            $image,
            ProfileStartPolicy::WORKSPACE,
            ExecutionBudgets::mainAgent(),
            [],
            ProfileBase::mainAgent()->isAttachable(),
        );
        SessionPolicy::query()->where('session_id', $opened->sessionId)->delete();
        SessionPolicy::create(
            AgentSession::query()->findOrFail($opened->sessionId),
            new StartPolicy(ProfileBase::mainAgent()->defaultAccess(), StopConditions::make([]), $execution, null, null, null),
        );

        $grant = $this->asSystem(new ClaimStartGrantCommand($host->hostId, $opened->runtimeId));
        $manifest = $grant->container;

        $this->assertNotNull($manifest);
        $this->assertTrue($manifest->attachable);
        $this->assertSame($image, $manifest->image);
        $this->assertSame("acme-{$opened->sessionId}", $manifest->network);
        $this->assertSame(
            [
                '/srv/journal/workspaces/main',
                '/srv/journal/accounts/01plain',
                "acme-history-{$opened->sessionId}",
                "/srv/journal/sessions/{$opened->sessionId}",
            ],
            array_map(fn ($mount) => $mount->source, $manifest->mounts),
        );
        $this->assertTrue($manifest->mounts[0]->writable);
        $wire = json_decode(json_encode($grant->toArray(), JSON_THROW_ON_ERROR), true, 512, JSON_THROW_ON_ERROR);
        $this->assertTrue($wire['container']['attachable']);
        $this->assertSame('daemon-bind', $wire['container']['mounts'][0]['type']);
    }

    public function test_a_protected_headless_start_runs_on_the_messages_both_sides_keep(): void
    {
        config(['agents.protected_account_trial' => DefaultDrivers::CLAUDE_CODE]);
        $account = Account::create(DefaultDrivers::CLAUDE_CODE, AccountLabel::from('Plain'), '/journal/accounts/01plain');
        ActiveAccount::lockedFor(DefaultDrivers::CLAUDE_CODE)->select($account);
        [$host, $opened] = $this->openRuntime('Say hello');
        // The host is a contained one, as the installation's arrangement below says.
        Host::query()->findOrFail($host->hostId)->forceFill(['arrangement' => ArrangementType::Contained])->save();
        $this->app->instance(
            ArrangementSetting::class,
            ArrangementSetting::fromConfig('contained', 'acme', '{"main":{"folder":"main"}}'),
        );
        $this->app->forgetInstance(LaunchProfiles::class);
        $execution = ExecutionPolicy::make(
            ExecutionModeType::RequiredContainer,
            'journal-agent@sha256:'.str_repeat('a', 64),
            ProfileStartPolicy::WORKSPACE,
            ExecutionBudgets::mainAgent(),
            [],
            ProfileBase::mainAgent()->isAttachable(),
        );
        SessionPolicy::query()->where('session_id', $opened->sessionId)->delete();
        SessionPolicy::create(
            AgentSession::query()->findOrFail($opened->sessionId),
            new StartPolicy(ProfileBase::mainAgent()->defaultAccess(), StopConditions::make([]), $execution, null, null, null),
        );

        $fixedValues = [
            $opened->sessionId => '01contractsession000000000',
            $opened->runtimeId => '01contractruntime000000000',
        ];
        $claimed = $this->hostCall(
            $host,
            '/host/claim?limit=10&wait=0&watched_version=0&arrangement=contained',
            [],
        )->assertSuccessful();
        $fixedValues[(string) $claimed->json('requests.0.requestId')] = '01contractrequest000000000';
        $fixedValues[(string) $claimed->json('requests.0.processStartId')] = '01contractstart00000000000';

        HostContract::of('host-start/protected-headless-claude/requests.json')->assertHolds((array) $claimed->json(), $fixedValues);

        $grant = $this->asSystem(new ClaimStartGrantCommand($host->hostId, $opened->runtimeId));

        HostContract::of('host-start/protected-headless-claude/grant.json')->assertHolds($grant->toArray(), [
            $grant->toArray()['token'] => 'contract-token',
            $grant->toArray()['offline_reply_seal'] => 'contract-seal',
            $opened->sessionId => '01contractsession000000000',
        ]);

        // What the host's own scenario sends about the agent image: every item has its mechanism and awaits its run.
        $report = HostContract::of('host-start/protected-headless-claude/protection-report.json')->read();
        $this->hostCall($host, '/host/reports/protection', $report)->assertSuccessful();
        $claim = $this->hostCall($host, '/host/starts/claim', ['session_id' => $opened->sessionId])->assertSuccessful();

        HostContract::of('host-start/protected-headless-claude/claim.json')->assertHolds((array) $claim->json(), [
            (string) $claim->json('start_key') => 'contract-start-key',
            $opened->sessionId => '01contractsession000000000',
            $account->id => '01contractaccount000000000',
        ]);

        // What the host's scenario reports once the turn ran in its container: the journal keeps the conversation whole.
        $applied = HostContract::of('host-start/protected-headless-claude/request-report.json')->readFor($fixedValues);
        $this->hostCall($host, '/host/reports/request', $applied)->assertSuccessful();

        $request = DriverRequest::query()->findOrFail($applied['request_id']);
        $this->assertSame(RequestProgress::Applied, $request->progress);
        $this->assertSame($applied['actual_binding'], $request->actual_binding);
    }

    public function test_a_contained_session_whose_account_folder_is_no_plain_id_gets_no_grant(): void
    {
        [$host, $opened] = $this->openRuntime();
        $this->app->instance(
            ArrangementSetting::class,
            ArrangementSetting::fromConfig('contained', 'acme', '{"main":{"folder":"main"}}'),
        );
        $execution = ExecutionPolicy::make(
            ExecutionModeType::RequiredContainer,
            'journal-agent@sha256:'.str_repeat('a', 64),
            ProfileStartPolicy::WORKSPACE,
            ExecutionBudgets::mainAgent(),
            [],
            true,
        );
        SessionPolicy::query()->where('session_id', $opened->sessionId)->delete();
        SessionPolicy::create(
            AgentSession::query()->findOrFail($opened->sessionId),
            new StartPolicy(ProfileBase::mainAgent()->defaultAccess(), StopConditions::make([]), $execution, null, null, null),
        );

        $this->assertThrows(
            fn () => $this->asSystem(new ClaimStartGrantCommand($host->hostId, $opened->runtimeId)),
            AccountFolderInvalid::class,
        );
    }

    public function test_an_applied_request_keeps_the_drivers_whole_session_id(): void
    {
        [, $opened] = $this->openRuntime();
        $request = DriverRequest::query()->findOrFail($this->deliver($opened, 'key-1', 'Hello')->requestId);
        $sessionId = (string) Str::uuid();

        $request->markApplied($sessionId);

        $this->assertSame($sessionId, $request->refresh()->actual_binding);
    }

    public function test_a_driver_without_a_screen_gets_a_container_without_a_terminal_whatever_its_profile(): void
    {
        $execution = ExecutionPolicy::make(
            ExecutionModeType::RequiredContainer,
            'journal-agent@sha256:'.str_repeat('a', 64),
            ProfileStartPolicy::WORKSPACE,
            ExecutionBudgets::mainAgent(),
            [],
            ProfileBase::mainAgent()->isAttachable(),
        );

        $this->assertTrue($execution->forDriverScreen(true)->attachable);
        $this->assertFalse($execution->forDriverScreen(false)->attachable);
    }

    public function test_helpers_are_never_attachable(): void
    {
        $this->assertTrue(ProfileBase::mainAgent()->isAttachable());
        $this->assertFalse(ProfileBase::readOnlyHelper()->isAttachable());
        $this->assertFalse(ProfileBase::writingHelper()->isAttachable());
    }

    public function test_another_host_cannot_take_a_runtimes_start_grant(): void
    {
        [, $opened] = $this->openRuntime();
        $other = $this->enrollHost();

        $this->expectException(HostReportRefused::class);

        $this->asSystem(new ClaimStartGrantCommand($other->hostId, $opened->runtimeId));
    }

    public function test_a_new_process_that_comes_up_idle_with_unshown_chat_text_asks_for_one_wake(): void
    {
        [$host, $opened] = $this->openRuntime();
        $agent = ActorIdentity::of(AgentSession::query()->with('agent')->findOrFail($opened->sessionId)->agent);
        $user = User::factory()->create();
        $chat = $this->pairChat(ActorIdentity::of($user), $agent);
        $this->app->instance(AccessSettings::class, new AccessSettings($user->id));
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser($user->id), new OwnerAuthority('test'));
        $this->app->make(RequestKey::class)->set((string) Str::ulid());
        $this->app->make(CommandBus::class)->run(new PostChatMessageCommand($chat->inbox_id, 'Plan?', 'plan-1'));
        $this->app->make(RequestKey::class)->forget();
        $asked = $this->wakesAskedOf($opened);
        $restart = new ReportRuntimeActivityCommand($host->hostId, $opened->runtimeId, RuntimeActivity::Idle, HoldReason::None, 2);

        $this->asSystem($restart);
        $this->asSystem($restart);

        $this->assertSame($asked + 1, $this->wakesAskedOf($opened));
    }

    public function test_a_new_process_with_nothing_unshown_asks_for_no_wake(): void
    {
        [$host, $opened] = $this->openRuntime();
        $asked = $this->wakesAskedOf($opened);

        $this->asSystem(
            new ReportRuntimeActivityCommand($host->hostId, $opened->runtimeId, RuntimeActivity::Idle, HoldReason::None, 2),
        );

        $this->assertSame($asked, $this->wakesAskedOf($opened));
    }

    public function test_a_session_long_silent_while_its_host_beats_for_another_is_ended_as_unserved(): void
    {
        [$host, $served] = $this->openRuntime();
        $unserved = $this->secondRuntimeOn($host);
        AgentSession::query()->whereKey($served->sessionId)->update(['last_heartbeat_at' => CarbonImmutable::now()]);
        $this->silenceSince($unserved, CarbonImmutable::now()->subMinutes(11));

        $this->app->make(HeartbeatService::class)->markSilentStarts();

        $this->assertSame(
            [true, false],
            [
                AgentSession::query()->findOrFail($served->sessionId)->isActive(),
                AgentSession::query()->findOrFail($unserved->sessionId)->isActive(),
            ],
        );
    }

    public function test_a_silent_session_whose_host_beats_for_nothing_stays_silent(): void
    {
        [, $opened] = $this->openRuntime();
        $this->silenceSince($opened, CarbonImmutable::now()->subMinutes(11));

        $this->app->make(HeartbeatService::class)->markSilentStarts();

        $this->assertSame(SessionStatus::Silent, AgentSession::query()->findOrFail($opened->sessionId)->status);
    }

    public function test_a_report_of_an_older_generation_is_refused_and_leaves_newer_facts(): void
    {
        [$host, $opened] = $this->openRuntime();
        $this->asSystem(
            new ReportRuntimeActivityCommand($host->hostId, $opened->runtimeId, RuntimeActivity::Running, HoldReason::None, 2),
        );

        try {
            $this->asSystem(
                new ReportRuntimeActivityCommand(
                    $host->hostId,
                    $opened->runtimeId,
                    RuntimeActivity::Idle,
                    HoldReason::None,
                    1,
                ),
            );
            $this->fail('A stale report was applied.');
        } catch (HostReportRefused) {
            $this->assertSame(
                RuntimeActivity::Running,
                AgentRuntime::query()->findOrFail($opened->runtimeId)->activity,
            );
        }
    }

    public function test_a_started_turn_runs_and_a_finished_one_leaves_the_runtime_idle(): void
    {
        [$host, $opened] = $this->openRuntime();

        $this->asSystem(
            new ReportDriverTurnCommand($host->hostId, $opened->runtimeId, 1, 'prompt-1', false, 'opus', 'high', null),
        );
        $this->assertSame(RuntimeActivity::Running, AgentRuntime::query()->findOrFail($opened->runtimeId)->activity);

        $this->asSystem(
            new ReportDriverTurnCommand($host->hostId, $opened->runtimeId, 1, 'prompt-1', true, 'opus', 'high', 'finished'),
        );

        $runtime = AgentRuntime::query()->findOrFail($opened->runtimeId);
        $this->assertSame(RuntimeActivity::Idle, $runtime->activity);
        $this->assertSame('high', $runtime->observed_effort);
        $this->assertSame(1, DriverTurn::query()->where('agent_runtime_id', $opened->runtimeId)->count());
    }

    public function test_the_reader_keeps_a_staged_effort_apart_from_the_observed_one(): void
    {
        [, $opened] = $this->openRuntime();
        AgentRuntime::query()->findOrFail($opened->runtimeId)->forceFill(['requested_effort' => 'low'])->save();

        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser('owner'), new OwnerAuthority('test'));
        $status = $this->app->make(RuntimeResolver::class)->forSession($opened->sessionId);

        $this->assertSame('low', $status->effort->requested);
        $this->assertInstanceOf(Optional::class, $status->effort->observed);
        $this->assertTrue($status->isStale);
    }

    public function test_a_heartbeat_of_the_current_generation_refreshes_the_session(): void
    {
        [$host, $opened] = $this->openRuntime();
        $generation = AgentRuntime::query()->findOrFail($opened->runtimeId)->process_generation;

        $this->asSystem(
            new ReportRuntimeHeartbeatCommand($host->hostId, $opened->runtimeId, $generation, 'owned process alive'),
        );

        $this->assertNotNull(AgentSession::query()->findOrFail($opened->sessionId)->last_heartbeat_at);
    }

    /**
     * An idle runtime reports nothing between two turns, so its last report grew stale after a
     * minute and its session read as Status unknown though nothing was wrong.
     */
    public function test_a_heartbeat_keeps_an_idle_runtimes_report_fresh(): void
    {
        [$host, $opened] = $this->openRuntime();
        $runtime = AgentRuntime::query()->findOrFail($opened->runtimeId);
        $this->asSystem(
            new ReportRuntimeActivityCommand(
                $host->hostId,
                $opened->runtimeId,
                RuntimeActivity::Idle,
                HoldReason::None,
                $runtime->process_generation,
            ),
        );

        $this->travel(AgentRuntime::FRESH_SECONDS + 1)->seconds();
        $this->assertTrue($runtime->refresh()->isStale(CarbonImmutable::now()));

        $this->asSystem(
            new ReportRuntimeHeartbeatCommand(
                $host->hostId,
                $opened->runtimeId,
                $runtime->process_generation,
                'owned process alive',
            ),
        );

        $this->assertFalse($runtime->refresh()->isStale(CarbonImmutable::now()));
        $this->assertSame(RuntimeActivity::Idle, $runtime->activity);
    }

    /**
     * A page learns that a session's state changed from the host's report itself, so its header
     * never waits for a reload; a beat that only keeps a fresh report fresh says nothing.
     */
    public function test_a_report_that_changes_a_sessions_state_tells_the_pages_and_a_plain_beat_does_not(): void
    {
        [$host, $opened] = $this->openRuntime();
        $generation = AgentRuntime::query()->findOrFail($opened->runtimeId)->process_generation;
        $idle = new ReportRuntimeActivityCommand(
            $host->hostId,
            $opened->runtimeId,
            RuntimeActivity::Idle,
            HoldReason::None,
            $generation,
        );
        $beat = new ReportRuntimeHeartbeatCommand($host->hostId, $opened->runtimeId, $generation, 'owned process alive');
        $told = fn (SessionStateChanged $change) => $change->sessionId === $opened->sessionId;
        Event::fake([SessionStateChanged::class]);

        $this->asSystem($idle);
        Event::assertDispatchedTimes(SessionStateChanged::class, 1);
        Event::assertDispatched(SessionStateChanged::class, $told);

        $this->asSystem($beat);
        Event::assertDispatchedTimes(SessionStateChanged::class, 1);

        $this->travel(AgentRuntime::FRESH_SECONDS + 1)->seconds();
        $this->asSystem($beat);
        Event::assertDispatchedTimes(SessionStateChanged::class, 2);
    }

    public function test_a_heartbeat_of_another_generation_is_refused(): void
    {
        [$host, $opened] = $this->openRuntime();

        $this->expectException(HostReportRefused::class);

        $this->asSystem(new ReportRuntimeHeartbeatCommand($host->hostId, $opened->runtimeId, 99, 'owned process alive'));
    }

    public function test_a_verified_exit_ends_the_session(): void
    {
        [$host, $opened] = $this->openRuntime();
        $generation = AgentRuntime::query()->findOrFail($opened->runtimeId)->process_generation;

        $this->asSystem(new ReportRuntimeExitCommand($host->hostId, $opened->runtimeId, $generation, 'exit code 0'));

        $this->assertSame(SessionStatus::Ended, AgentSession::query()->findOrFail($opened->sessionId)->status);
    }

    public function test_a_confirmed_stop_ends_the_session_revokes_it_and_leaves_no_request_open(): void
    {
        [$host, $opened] = $this->openRuntime();
        $this->deliver($opened, 'before-stop', 'Never delivered');
        $this->asOwner(new StopAgentCommand($this->agentIdOf($opened), $opened->sessionId, 'stop-1'));

        $this->reportExit($host, $opened);

        $session = AgentSession::query()->with('startToken')->findOrFail($opened->sessionId);
        $requests = DriverRequest::query()->where('agent_runtime_id', $opened->runtimeId)->get();
        $this->assertSame(SessionStatus::Ended, $session->status);
        $this->assertTrue($session->startToken?->isRevoked());
        $this->assertSame(RuntimeActivity::Stopped, AgentRuntime::query()->findOrFail($opened->runtimeId)->activity);
        $this->assertTrue($requests->every(fn (DriverRequest $request) => $request->progress->isFinal()));
        $progress = $requests->mapWithKeys(
            fn (DriverRequest $request) => [$request->operation->value => $request->progress],
        );
        $this->assertSame(RequestProgress::Applied, $progress[DriverOperation::Stop->value]);
        $this->assertSame(RequestProgress::Unavailable, $progress[DriverOperation::Deliver->value]);
    }

    public function test_a_wake_after_the_session_ended_is_refused(): void
    {
        [$host, $opened] = $this->openRuntime();
        $this->reportExit($host, $opened);

        $this->expectException(DriverRequestRefused::class);

        $this->asOwner(new WakeAgentCommand($this->agentIdOf($opened), $opened->sessionId, 'wake-after-exit'));
    }

    public function test_a_refused_message_wake_keeps_the_session_its_credentials_and_its_start(): void
    {
        [$host, $opened] = $this->openRuntime();
        $wake = $this->asOwner(new WakeAgentCommand($this->agentIdOf($opened), $opened->sessionId, 'message-wake'));
        $claimed = $this->claimedScript($host, $wake->requestId);

        $this->reportRefusedWake($host, $claimed, 'container-unavailable', true);

        $session = AgentSession::query()->findOrFail($opened->sessionId);
        $this->assertSame(SessionStatus::Active, $session->status);
        $this->assertNull(ProcessStart::latestOfSession($opened->sessionId)?->refusal);
        $this->assertSame(RequestProgress::Failed, DriverRequest::query()->findOrFail($wake->requestId)->progress);
    }

    public function test_a_proved_unstarted_initial_wake_ends_the_launch_once_with_its_reason(): void
    {
        [$host, $opened] = $this->openRuntime();
        $wake = $this->asOwner(new WakeAgentCommand(
            $this->agentIdOf($opened),
            $opened->sessionId,
            InitialWakeSettlement::keyOf($opened->sessionId),
        ));
        $claimed = $this->claimedScript($host, $wake->requestId);

        $this->reportRefusedWake($host, $claimed, 'container-unavailable', true);
        $this->reportRefusedWake($host, $claimed, 'container-unavailable', true);

        $session = AgentSession::query()->findOrFail($opened->sessionId);
        $start = ProcessStart::latestOfSession($opened->sessionId);
        $this->assertSame(SessionStatus::Ended, $session->status);
        $this->assertSame(self::NO_CONTAINER, $start?->refusal);
    }

    public function test_a_generic_refusal_of_the_initial_wake_keeps_the_launch_for_reconciliation(): void
    {
        [$host, $opened] = $this->openRuntime();
        $wake = $this->asOwner(new WakeAgentCommand(
            $this->agentIdOf($opened),
            $opened->sessionId,
            InitialWakeSettlement::keyOf($opened->sessionId),
        ));
        $claimed = $this->claimedScript($host, $wake->requestId);

        $this->reportRefusedWake($host, $claimed, null, false);

        $this->assertSame(SessionStatus::Active, AgentSession::query()->findOrFail($opened->sessionId)->status);
        $this->assertNull(ProcessStart::latestOfSession($opened->sessionId)?->refusal);
    }

    public function test_two_stops_of_the_same_generation_converge_on_one_request(): void
    {
        [, $opened] = $this->openRuntime();
        $agentId = $this->agentIdOf($opened);
        $generation = AgentRuntime::query()->findOrFail($opened->runtimeId)->process_generation;

        $first = $this->asOwner(new StopAgentCommand($agentId, $opened->sessionId, 'stop-a', $generation));
        $second = $this->asOwner(new StopAgentCommand($agentId, $opened->sessionId, 'stop-b', $generation));

        $this->assertSame($first->requestId, $second->requestId);
        $this->assertSame(1, DriverRequest::query()->where('operation', DriverOperation::Stop)->count());
        $this->assertThrows(
            fn () => $this->asOwner(new StopAgentCommand($agentId, $opened->sessionId, 'stop-c', $generation + 1)),
            StopOutdated::class,
        );
    }

    public function test_an_applied_stop_keeps_stopping_until_the_exit_of_its_generation_is_proved(): void
    {
        [$host, $opened] = $this->openRuntime();
        $agentId = $this->agentIdOf($opened);
        $runtime = AgentRuntime::query()->findOrFail($opened->runtimeId);
        $stop = $this->asOwner(new StopAgentCommand($agentId, $opened->sessionId, 'stop-1', $runtime->process_generation));
        $this->asSystem(new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()));
        $this->reportProgress($host->hostId, $stop->requestId, RequestProgress::Applied);

        $this->assertSame('Stopping', $this->statusOf($agentId)->label);

        $this->assertThrows(
            fn () => $this->asSystem(
                new ReportRuntimeExitCommand($host->hostId, $opened->runtimeId, $runtime->process_generation - 1, 'old exit'),
            ),
            HostReportRefused::class,
        );
        $this->assertSame(SessionStatus::Active, AgentSession::query()->findOrFail($opened->sessionId)->status);

        $this->reportExit($host, $opened);

        $this->assertSame('Stopped', $this->statusOf($agentId)->label);
    }

    public function test_a_stop_waiting_for_its_helpers_says_so(): void
    {
        [, $main] = $this->openRuntime();
        [, $helper] = $this->openRuntime();
        AgentSession::query()->whereKey($helper->sessionId)->update(['parent_session_id' => $main->sessionId]);
        $agentId = $this->agentIdOf($main);

        $this->asOwner(new StopAgentCommand($agentId, $main->sessionId, 'stop-main'));

        $this->assertSame(self::STOPPING_LABEL, $this->statusOf($agentId)->label);
    }

    public function test_retiring_an_agent_with_a_running_runtime_stops_it_through_its_host(): void
    {
        [$host, $opened] = $this->openRuntime();

        $this->asOwner(new RetireAgentCommand($this->agentIdOf($opened)));

        $stop = DriverRequest::query()->where('agent_runtime_id', $opened->runtimeId)
            ->where('operation', DriverOperation::Stop)->sole();
        $this->assertSame(RuntimeActivity::Stopping, AgentRuntime::query()->findOrFail($opened->runtimeId)->activity);
        $this->assertSame(SessionStatus::Active, AgentSession::query()->findOrFail($opened->sessionId)->status);
        $this->assertFalse($stop->progress->isFinal());

        $this->reportExit($host, $opened);

        $this->assertSame(SessionStatus::Ended, AgentSession::query()->findOrFail($opened->sessionId)->status);
        $this->assertSame(RequestProgress::Applied, $stop->fresh()?->progress);
    }

    public function test_a_host_report_of_unavailable_leaves_the_request_unavailable_and_a_failure_stays_failed(): void
    {
        [$host, $opened] = $this->openRuntime();
        $unavailable = $this->deliver($opened, 'host-restarted', 'Hello');
        $failed = $this->deliver($opened, 'host-refused', 'Hello again');
        $this->asSystem(new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()));
        $this->reportProgress($host->hostId, $unavailable->requestId, RequestProgress::Unavailable);
        $this->reportProgress($host->hostId, $failed->requestId, RequestProgress::Failed);

        $request = DriverRequest::query()->findOrFail($unavailable->requestId);

        $this->assertSame(RequestProgress::Unavailable, $request->progress);
        $this->assertSame(RequestOutcome::EntryUnavailable, $request->outcome);
        $this->assertSame(RequestProgress::Failed, DriverRequest::query()->findOrFail($failed->requestId)->progress);

        $this->asOwner(new RetryDriverRequestCommand($request->id, $request->row_version, 'the runtime is back'));

        $this->assertSame(RequestProgress::Accepted, $request->fresh()?->progress);
    }

    public function test_the_host_reports_a_navigation_hold_and_ends_requests_unavailable_or_unconfirmed(): void
    {
        [$host, $opened] = $this->openRuntime();
        $runtime = AgentRuntime::query()->findOrFail($opened->runtimeId);
        $unavailable = $this->deliver($opened, 'entry-gone', 'Pick GPT-6');
        $unconfirmed = $this->deliver($opened, 'only-highlighted', 'Pick GPT-6 again');
        $this->asSystem(new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()));

        $this->hostCall($host, '/host/reports/activity', [
            'runtime_id' => $runtime->id,
            'activity' => RuntimeActivity::Running->value,
            'hold' => HoldReason::NavigationNeeded->value,
            'process_generation' => $runtime->process_generation,
        ])->assertSuccessful();
        $ends = [[$unavailable, 'unavailable', 'entry_unavailable'], [$unconfirmed, 'failed', 'unconfirmed']];
        $attempts = DriverRequest::query()
            ->whereKey([$unavailable->requestId, $unconfirmed->requestId])
            ->limit(2)
            ->pluck('attempt_version', 'id');

        foreach ($ends as [$receipt, $progress, $outcome]) {
            $this->hostCall($host, '/host/reports/request', [
                'request_id' => $receipt->requestId,
                'attempt' => $attempts[$receipt->requestId],
                'progress' => $progress,
                'actual_binding' => null,
                'outcome' => $outcome,
            ])->assertSuccessful();
        }

        $this->assertSame(HoldReason::NavigationNeeded, $runtime->fresh()?->hold_reason);
        $gone = DriverRequest::query()->findOrFail($unavailable->requestId);
        $this->assertSame(
            [RequestProgress::Unavailable, RequestOutcome::EntryUnavailable],
            [$gone->progress, $gone->outcome],
        );
        $highlighted = DriverRequest::query()->findOrFail($unconfirmed->requestId);
        $this->assertSame(
            [RequestProgress::Failed, RequestOutcome::Unconfirmed],
            [$highlighted->progress, $highlighted->outcome],
        );
    }

    public function test_the_host_reports_the_reason_it_refused_a_request_and_that_no_process_was_made(): void
    {
        [$host, $opened] = $this->openRuntime();
        $refused = $this->deliver($opened, 'no-container', 'Hello');
        $unnamed = $this->deliver($opened, 'odd-reason', 'Hello again');
        $missing = $this->deliver($opened, 'old-build', 'Hello once more');
        $claimed = $this->claimedScript($host, $refused->requestId);
        $runtime = AgentRuntime::query()->findOrFail($opened->runtimeId);
        $this->assertSame(
            [$runtime->agent_session_id, $runtime->process_generation],
            [$claimed['sessionId'], $claimed['processGeneration']],
        );
        $attempts = DriverRequest::query()
            ->whereKey([$refused->requestId, $unnamed->requestId, $missing->requestId])
            ->limit(3)
            ->pluck('attempt_version', 'id');
        $reports = [[$refused, 'container-unavailable'], [$unnamed, 'disk-on-fire'], [$missing, 'pinned-build-missing']];

        foreach ($reports as [$receipt, $reason]) {
            $this->hostCall($host, '/host/reports/request', [
                'request_id' => $receipt->requestId,
                'attempt' => $attempts[$receipt->requestId],
                'progress' => 'failed',
                'actual_binding' => null,
                'outcome' => 'refused',
                'refusal_reason' => $reason,
                'no_process_created' => true,
                'session_id' => $claimed['sessionId'],
                'process_start_id' => $claimed['processStartId'],
                'process_generation' => $claimed['processGeneration'],
            ])->assertSuccessful();
        }

        $kept = DriverRequest::query()->findOrFail($refused->requestId);
        $unknown = DriverRequest::query()->findOrFail($unnamed->requestId);
        $this->assertSame(
            [HostWakeRefusal::ContainerUnavailable, true, HostWakeRefusal::Unknown, true],
            [$kept->refusal_reason, $kept->no_process_created, $unknown->refusal_reason, $unknown->no_process_created],
        );
        $this->assertSame(
            HostRefusal::PinnedBuildMissing,
            DriverRequest::query()->findOrFail($missing->requestId)->refusal_reason?->startReason(),
        );
    }

    public function test_retrying_a_failed_request_starts_a_new_attempt_and_refuses_reports_of_the_old_one(): void
    {
        [$host, $opened] = $this->openRuntime();
        $receipt = $this->deliver($opened, 'fails-once', 'Hello');
        $this->asSystem(new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()));
        $request = DriverRequest::query()->findOrFail($receipt->requestId);
        $oldAttempt = $request->attempt_version;
        $this->asSystem(new ReportRequestProgressCommand(
            $host->hostId,
            $request->id,
            $oldAttempt,
            RequestProgress::Failed,
            null,
            RequestOutcome::EntryUnavailable,
            refusal: HostWakeRefusal::ContainerUnavailable,
            noProcessCreated: true,
        ));
        $request->refresh();

        $this->asOwner(new RetryDriverRequestCommand($request->id, $request->row_version, 'the entry is back'));

        $request->refresh();
        $this->assertSame(
            [RequestProgress::Accepted, $oldAttempt + 1],
            [$request->progress, $request->attempt_version],
        );
        $this->expectException(HostReportRefused::class);
        $this->asSystem(new ReportRequestProgressCommand(
            $host->hostId,
            $request->id,
            $oldAttempt,
            RequestProgress::Applied,
            'late',
            null,
        ));
    }

    public function test_an_uncertain_delivery_is_resolved_not_retried(): void
    {
        [$host, $opened] = $this->openRuntime();
        $receipt = $this->deliver($opened, 'uncertain', 'Hello');
        $this->asSystem(new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()));
        $request = DriverRequest::query()->findOrFail($receipt->requestId);
        $this->asSystem(new ReportRequestProgressCommand(
            $host->hostId,
            $request->id,
            $request->attempt_version,
            RequestProgress::DeliveryUncertain,
            null,
            null,
        ));
        $request->refresh();

        $this->assertThrows(
            fn () => $this->asOwner(new RetryDriverRequestCommand($request->id, $request->row_version, 'again')),
            DriverRequestRefused::class,
        );
        $this->asOwner(new ResolveDriverDeliveryCommand($request->id, $request->row_version, false, 'never arrived'));

        $this->assertSame(RequestProgress::Unavailable, $request->fresh()?->progress);
    }

    public function test_a_wake_has_no_delivery_to_resolve(): void
    {
        [, $opened] = $this->openRuntime();
        $wake = $this->asOwner(new WakeAgentCommand($this->agentIdOf($opened), $opened->sessionId, 'wake-1'));
        $request = DriverRequest::query()->findOrFail($wake->requestId);

        $this->expectException(DriverRequestRefused::class);

        $this->asOwner(new ResolveDriverDeliveryCommand($request->id, $request->row_version, true, 'it woke'));
    }

    public function test_cancelling_a_setting_puts_the_requested_settings_back_and_is_recorded(): void
    {
        Event::fake([DriverRequestRecovered::class]);
        [, $opened] = $this->openRuntime();
        $agentId = $this->agentIdOf($opened);
        $this->asOwner(new ChangeAgentModelCommand($agentId, $opened->sessionId, 'model-1', 'claude-sonnet-5-5'));
        $effort = $this->asOwner(new ChangeAgentEffortCommand($agentId, $opened->sessionId, 'effort-1', 'high'));
        $request = DriverRequest::query()->findOrFail($effort->requestId);

        $this->asOwner(new CancelDriverRequestCommand($request->id, $request->row_version, 'not needed after all'));

        $runtime = AgentRuntime::query()->findOrFail($opened->runtimeId);
        $this->assertSame(RequestProgress::Cancelled, $request->fresh()?->progress);
        $this->assertSame(['claude-sonnet-5-5', null], [$runtime->requested_model, $runtime->requested_effort]);
        Event::assertDispatched(
            DriverRequestRecovered::class,
            fn (DriverRequestRecovered $event) => $event->requestId === $request->id
                && $event->action === RecoveryAction::Cancelled
                && $event->reason === 'not needed after all',
        );
    }

    public function test_a_request_changed_since_it_was_read_is_refused(): void
    {
        [, $opened] = $this->openRuntime();
        $receipt = $this->deliver($opened, 'stale', 'Hello');
        $request = DriverRequest::query()->findOrFail($receipt->requestId);

        $this->expectException(DriverRequestRefused::class);

        $this->asOwner(new CancelDriverRequestCommand($request->id, $request->row_version + 1, 'too late'));
    }

    public function test_a_failed_effort_change_is_repaired_in_its_own_place_in_the_queue(): void
    {
        [$host, $opened] = $this->openRuntime();
        $agentId = $this->agentIdOf($opened);
        $effort = $this->asOwner(new ChangeAgentEffortCommand($agentId, $opened->sessionId, 'effort-1', 'high'));
        $this->asSystem(new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()));
        $request = DriverRequest::query()->findOrFail($effort->requestId);
        $attempt = $request->attempt_version;
        $this->asSystem(new ReportRequestProgressCommand(
            $host->hostId,
            $request->id,
            $attempt,
            RequestProgress::Failed,
            null,
            RequestOutcome::Refused,
        ));
        $request->refresh();
        $sequence = $request->sequence;

        $this->asOwner(new RepairDriverSettingsCommand($request->id, $request->row_version, 'low', 'high is not offered'));

        $request->refresh();
        $this->assertSame([RequestProgress::Accepted, 'low'], [$request->progress, $request->effort]);
        $this->assertSame([$sequence, $attempt + 1], [$request->sequence, $request->attempt_version]);
        $this->assertSame('low', AgentRuntime::query()->findOrFail($opened->runtimeId)->requested_effort);
    }

    public function test_a_user_releases_an_interrupt_but_never_a_hold_the_program_shows(): void
    {
        [$host, $opened] = $this->openRuntime();
        $agentId = $this->agentIdOf($opened);
        $this->asOwner(new InterruptAgentCommand($agentId, $opened->sessionId, 'interrupt-1'));
        $this->asOwner(new WakeAgentCommand($agentId, $opened->sessionId, 'wake-after-interrupt'));
        $runtime = fn () => AgentRuntime::query()->findOrFail($opened->runtimeId);
        $this->assertSame(HoldReason::Interrupted, $runtime()->hold_reason);

        $this->asOwner(new ReleaseAgentHoldCommand($agentId, $opened->sessionId, HoldReason::Interrupted, 'go on'));
        $this->assertSame(HoldReason::None, $runtime()->hold_reason);

        $this->asSystem(new ReportRuntimeActivityCommand(
            $host->hostId,
            $opened->runtimeId,
            RuntimeActivity::Running,
            HoldReason::Compacting,
            1,
        ));
        $this->expectException(DriverRequestRefused::class);
        $this->asOwner(new ReleaseAgentHoldCommand($agentId, $opened->sessionId, HoldReason::Compacting, 'hurry'));
    }

    public function test_a_stopped_key_script_resumes_from_its_step_or_is_cancelled(): void
    {
        [$host, $opened] = $this->openRuntime();
        $resumed = DriverRequest::query()->findOrFail(
            $this->asOwner($this->keyScript($opened, 'ChangeModel', ['model' => 'gpt-6']))->requestId,
        );
        $cancelled = DriverRequest::query()->findOrFail(
            $this->asOwner($this->keyScript($opened, 'ChangeModel', ['model' => 'opus']))->requestId,
        );

        foreach ([$resumed, $cancelled] as $request) {
            $this->asSystem(new ReportRequestProgressCommand(
                $host->hostId,
                $request->id,
                $request->attempt_version,
                RequestProgress::Applying,
                null,
                null,
                new ScriptProgress(2, 7, 'paused: a user typed'),
            ));
            $request->refresh();
        }

        $attempt = $resumed->attempt_version;

        $this->asOwner(new ResumeKeyScriptCommand($resumed->id, $resumed->row_version, 'done typing'));
        $this->asOwner(new CancelKeyScriptCommand($cancelled->id, $cancelled->row_version, 'not needed'));

        $resumed->refresh();
        $this->assertSame(RequestProgress::Accepted, $resumed->progress);
        $this->assertSame([$attempt + 1, 2], [$resumed->attempt_version, $resumed->script_step]);
        $this->assertSame(RequestProgress::Cancelled, $cancelled->fresh()?->progress);
    }

    public function test_the_owner_asks_the_host_to_start_and_stop_a_recording(): void
    {
        [, $opened] = $this->openRuntime();
        $agentId = $this->agentIdOf($opened);

        $start = $this->asOwner(new RecordRuntimeCommand($agentId, $opened->sessionId, 'record-1', false));
        $stop = $this->asOwner(new RecordRuntimeCommand($agentId, $opened->sessionId, 'record-2', true));

        $operations = DriverRequest::query()->whereKey([$start->requestId, $stop->requestId])->orderBy('sequence')
            ->pluck('operation')->all();
        $this->assertSame([DriverOperation::StartRecording, DriverOperation::StopRecording], $operations);
    }

    public function test_ending_the_main_stops_its_helpers_first_and_hands_its_own_stop_over_once_they_are_proven(): void
    {
        [$mainHost, $main] = $this->openRuntime();
        [$helperHost, $helper] = $this->openRuntime();
        AgentSession::query()->whereKey($helper->sessionId)->update(['parent_session_id' => $main->sessionId]);
        $stopOf = fn (OpenedRuntime $opened) => DriverRequest::query()->where('agent_runtime_id', $opened->runtimeId)
            ->where('operation', DriverOperation::Stop)->sole();

        $this->asOwner(new StopAgentCommand($this->agentIdOf($main), $main->sessionId, 'stop-main'));

        $this->assertSame(RuntimeActivity::Stopping, AgentRuntime::query()->findOrFail($helper->runtimeId)->activity);
        $this->assertSame([], $this->asSystem(new ClaimDriverRequestsCommand($mainHost->hostId, 10, BrowserInputCapabilities::none()))->requests);
        $this->assertSame(RequestProgress::Accepted, $stopOf($main)->progress);

        $helperClaim = $this->asSystem(new ClaimDriverRequestsCommand($helperHost->hostId, 10, BrowserInputCapabilities::none()));
        $this->assertSame(
            [DriverOperation::Stop->value],
            array_map(fn ($request) => $request->operation, $helperClaim->requests),
        );
        $this->reportExit($helperHost, $helper);

        $mainClaim = $this->asSystem(new ClaimDriverRequestsCommand($mainHost->hostId, 10, BrowserInputCapabilities::none()));
        $this->assertSame(
            [DriverOperation::Stop->value],
            array_map(fn ($request) => $request->operation, $mainClaim->requests),
        );
        $this->assertSame(SessionStatus::Active, AgentSession::query()->findOrFail($main->sessionId)->status);
        $this->assertSame(RequestProgress::Applied, $stopOf($helper)->progress);
    }

    public function test_a_stop_and_an_interrupt_are_claimed_past_a_full_batch_of_normal_work(): void
    {
        [$host, $opened] = $this->openRuntime();

        foreach (range(1, 12) as $number) {
            $this->deliver($opened, "work-{$number}", "Work {$number}");
        }

        $this->asOwner(new InterruptAgentCommand($this->agentIdOf($opened), $opened->sessionId, 'interrupt-1'));
        $this->asOwner(new StopAgentCommand($this->agentIdOf($opened), $opened->sessionId, 'stop-1'));

        $claimed = $this->asSystem(new ClaimDriverRequestsCommand($host->hostId, 5, BrowserInputCapabilities::none()));

        $operations = array_map(fn ($request) => $request->operation, $claimed->requests);
        $this->assertContains(DriverOperation::Interrupt->value, $operations);
        $this->assertContains(DriverOperation::Stop->value, $operations);
    }

    public function test_a_message_over_the_delivery_limit_is_refused_before_it_is_accepted(): void
    {
        config(['agents.driver_budgets.deliver_max_bytes' => 10]);
        $this->app->forgetInstance(DriverBudgets::class);
        [, $opened] = $this->openRuntime();

        $this->assertThrows(fn () => $this->deliver($opened, 'too-long', 'Eleven byte'), DriverRequestRefused::class);
        $this->assertSame(0, DriverRequest::query()->where('idempotency_key', 'too-long')->count());
    }

    public function test_a_hook_call_of_an_older_generation_is_refused(): void
    {
        [$host, $opened] = $this->openRuntime();
        $this->asSystem(
            new ReportRuntimeActivityCommand($host->hostId, $opened->runtimeId, RuntimeActivity::Running, HoldReason::None, 3),
        );

        $this->expectException(StaleProcessGeneration::class);

        $this->app->make(NativeTurns::class)->checkGeneration($opened->sessionId, 2);
    }

    public function test_each_native_prompt_id_makes_one_turn(): void
    {
        [, $opened] = $this->openRuntime();
        $turns = $this->app->make(NativeTurns::class);

        $turns->recordPrompt($opened->sessionId, 1, 'prompt-a');
        $turns->recordPrompt($opened->sessionId, 1, 'prompt-a');
        $turns->recordPrompt($opened->sessionId, 1, 'prompt-b');
        $turns->recordPrompt($opened->sessionId, 1, null);

        $this->assertSame(2, DriverTurn::query()->where('agent_runtime_id', $opened->runtimeId)->count());
    }

    public function test_a_signed_host_poll_returns_its_pending_requests(): void
    {
        [$host, $opened] = $this->openRuntime(firstMessage: 'Over the wire');
        $response = $this->hostCall($host, '/host/claim?limit=5&wait=0&watched_version=0');

        $response->assertOk();
        $this->assertSame($opened->firstRequestId, $response->json('requests.0.requestId'));
        $this->assertSame([], $response->json('requests.0.scriptParameters'));
    }

    public function test_a_claimed_key_script_carries_its_script_and_resumes_from_its_reported_step(): void
    {
        [$host, $opened] = $this->openRuntime();
        $receipt = $this->asOwner($this->keyScript($opened, 'ChangeModel', ['model' => 'gpt-6']));
        $request = DriverRequest::query()->findOrFail($receipt->requestId);

        $claimed = $this->claimedScript($host, $receipt->requestId);
        $this->assertSame(
            ['ChangeModel', 2, [['name' => 'model', 'value' => 'gpt-6']], null],
            [$claimed['script'], $claimed['scriptVersion'], $claimed['scriptParameters'], $claimed['scriptStep']],
        );

        $this->hostCall($host, '/host/reports/request', [
            'request_id' => $request->id,
            'attempt' => $claimed['attempt'],
            'progress' => RequestProgress::Applying->value,
            'actual_binding' => null,
            'outcome' => null,
            'script' => ['step' => 2, 'generation' => 7, 'evidence' => 'menu login-method, stable'],
        ])->assertSuccessful();
        $request->refresh();
        $this->assertSame([2, 'menu login-method, stable'], [$request->script_step, $request->script_evidence]);

        $this->asOwner(new ResumeKeyScriptCommand($request->id, $request->row_version, 'go on'));

        $this->assertSame(2, $this->claimedScript($host, $request->id)['scriptStep']);
    }

    public function test_an_operator_appends_one_registered_key_script_request(): void
    {
        [, $opened] = $this->openRuntime();

        $receipt = $this->asOwner($this->keyScript($opened, 'ChangeModel', ['model' => 'gpt-6']));

        $request = DriverRequest::query()->findOrFail($receipt->requestId);
        $this->assertSame(DriverOperation::KeyScript, $request->operation);
        $this->assertSame(['ChangeModel', 2], [$request->script_id, $request->script_version]);
        $this->assertSame(['model' => 'gpt-6'], $request->script_parameters);
    }

    public function test_an_unregistered_script_or_an_extra_parameter_is_refused_before_acceptance(): void
    {
        [, $opened] = $this->openRuntime();
        $before = DriverRequest::query()->count();

        $refused = [
            ['LoginMcp', ['server' => 'journal']],
            ['ChangeModel', ['model' => 'gpt-6', 'shell' => 'rm']],
            ['ChangeEffort', []],
        ];

        foreach ($refused as [$name, $parameters]) {
            $this->assertThrows(
                fn () => $this->asOwner($this->keyScript($opened, $name, $parameters)),
                KeyScriptRefused::class,
            );
        }

        $this->assertSame($before, DriverRequest::query()->count());
    }

    public function test_an_agent_cannot_run_a_key_script(): void
    {
        [, $opened] = $this->openRuntime();
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forAgent($this->agentIdOf($opened)),
            TestStartAuthority::forAgent($this->agentIdOf($opened)),
        );

        $this->expectException(ActorNotAllowed::class);
        $this->app->make(CommandBus::class)->run($this->keyScript($opened, 'ChangeModel', ['model' => 'gpt-6']));
    }

    public function test_a_progress_report_records_the_scripts_step_and_evidence(): void
    {
        [$host, $opened] = $this->openRuntime();
        $receipt = $this->asOwner($this->keyScript($opened, 'ChangeModel', ['model' => 'gpt-6']));
        $request = DriverRequest::query()->findOrFail($receipt->requestId);
        $progress = new ScriptProgress(2, 7, 'menu login-method, stable');

        $attempt = $request->attempt_version;
        $this->asSystem(
            new ReportRequestProgressCommand(
                $host->hostId,
                $request->id,
                $attempt,
                RequestProgress::Applying,
                null,
                null,
                $progress,
            ),
        );

        $request->refresh();
        $this->assertSame(2, $request->script_step);
        $this->assertSame(7, $request->script_generation);
        $this->assertSame(self::MENU_EVIDENCE, $request->script_evidence);
    }

    /**
     * The request as the host's claim hands it out.
     *
     * @return array<string, mixed>
     */
    private function claimedScript(EnrolledHost $host, string $requestId): array
    {
        $requests = $this->hostCall(
            $host,
            '/host/claim?limit=10&wait=0&watched_version=0',
        )->assertOk()->json('requests');

        return collect($requests)->firstOrFail(fn (array $claimed) => $claimed['requestId'] === $requestId);
    }

    /**
     * The host refuses a claimed wake, naming a reason and that no process was made only when it knows.
     *
     * @param  array<string, mixed>  $claimed
     */
    private function reportRefusedWake(
        EnrolledHost $host,
        array $claimed,
        string|null $reason,
        bool $noProcessCreated,
    ): void {
        $this->hostCall($host, '/host/reports/request', [
            'request_id' => $claimed['requestId'],
            'attempt' => $claimed['attempt'],
            'progress' => 'failed',
            'actual_binding' => null,
            'outcome' => 'refused',
            'refusal_reason' => $reason,
            'no_process_created' => $noProcessCreated,
            'session_id' => $claimed['sessionId'],
            'process_start_id' => $claimed['processStartId'],
            'process_generation' => $claimed['processGeneration'],
        ])->assertSuccessful();
    }

    private function statusOf(string $agentId): AgentStatus
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser('owner'), new OwnerAuthority('test'));

        return $this->app->make(AgentDirectory::class)->visibleAgent($agentId)->status;
    }

    private function reportExit(EnrolledHost $host, OpenedRuntime $opened): void
    {
        $generation = AgentRuntime::query()->findOrFail($opened->runtimeId)->process_generation;

        $this->asSystem(new ReportRuntimeExitCommand($host->hostId, $opened->runtimeId, $generation, 'exit code 0'));
    }

    public function test_a_numbered_report_sent_again_is_taken_once(): void
    {
        [$host, $opened] = $this->openRuntime();
        $receipt = $this->deliver($opened, 'replayed', 'Read the notes');
        $this->asSystem(new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()));

        $this->numberedReport($host->hostId, $receipt->requestId, RequestProgress::Applying, 1);
        $this->numberedReport($host->hostId, $receipt->requestId, RequestProgress::Applied, 2);
        $this->numberedReport($host->hostId, $receipt->requestId, RequestProgress::Applying, 1);

        $this->assertSame(RequestProgress::Applied, DriverRequest::query()->findOrFail($receipt->requestId)->progress);
        $this->assertSame(2, RuntimeEvent::query()->where('agent_runtime_id', $opened->runtimeId)->count());
    }

    public function test_an_idle_report_after_a_missing_one_leaves_the_running_request_uncertain(): void
    {
        [$host, $opened] = $this->openRuntime();
        $runtime = AgentRuntime::query()->findOrFail($opened->runtimeId);
        $receipt = $this->deliver($opened, 'gap', 'Read the notes');
        $this->asSystem(new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()));
        $this->numberedReport($host->hostId, $receipt->requestId, RequestProgress::Applying, 1);

        $this->asSystem(new ReportRuntimeActivityCommand(
            $host->hostId,
            $runtime->id,
            RuntimeActivity::Idle,
            HoldReason::None,
            $runtime->process_generation,
            3,
        ));

        $this->assertSame(
            RequestProgress::DeliveryUncertain,
            DriverRequest::query()->findOrFail($receipt->requestId)->progress,
        );
    }

    public function test_a_proven_no_effect_failure_is_retried_once_from_two_tabs(): void
    {
        [$host, $opened] = $this->openRuntime();
        $receipt = $this->deliver($opened, 'two-tabs', 'Hello');
        $this->asSystem(new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()));
        $this->reportProgress($host->hostId, $receipt->requestId, RequestProgress::Failed);
        $read = DriverRequest::query()->findOrFail($receipt->requestId);

        $first = $this->asOwner(new RetryDriverRequestCommand($read->id, $read->row_version, 'first tab'));
        $second = $this->asOwner(new RetryDriverRequestCommand($read->id, $read->row_version, 'second tab'));

        $this->assertSame($first, $second);
        $this->assertSame($read->attempt_version + 1, $read->fresh()?->attempt_version);
    }

    public function test_a_failure_without_proof_that_nothing_ran_is_not_retried(): void
    {
        [$host, $opened] = $this->openRuntime();
        $receipt = $this->deliver($opened, 'unproven', 'Hello');
        $this->asSystem(new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()));
        $request = DriverRequest::query()->findOrFail($receipt->requestId);
        $this->asSystem(new ReportRequestProgressCommand(
            $host->hostId,
            $request->id,
            $request->attempt_version,
            RequestProgress::Failed,
            null,
            RequestOutcome::Refused,
        ));
        $request->refresh();

        $this->assertThrows(
            fn () => $this->asOwner(new RetryDriverRequestCommand($request->id, $request->row_version, 'again')),
            DriverRequestRefused::class,
            DriverRequestRefused::noEffectUnproven($request->id)->getMessage(),
        );
    }

    public function test_an_uncertain_delivery_is_sent_again_only_as_a_confirmed_possible_duplicate(): void
    {
        [$host, $opened] = $this->openRuntime();
        $receipt = $this->deliver($opened, 'uncertain', 'Hello');
        $this->asSystem(new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()));
        $this->reportProgress($host->hostId, $receipt->requestId, RequestProgress::DeliveryUncertain);
        $original = DriverRequest::query()->findOrFail($receipt->requestId);

        $this->assertThrows(
            fn () => $this->asOwner(new RetryDriverRequestCommand($original->id, $original->row_version, 'retry')),
            DriverRequestRefused::class,
        );
        $this->assertThrows(
            fn () => $this->asOwner(new SendDriverRequestAgainCommand($original->id, false, 'again')),
            DriverRequestRefused::class,
            DriverRequestRefused::duplicateNotConfirmed($original->id)->getMessage(),
        );

        $againId = $this->asOwner(new SendDriverRequestAgainCommand($original->id, true, 'again'));
        $repeated = $this->asOwner(new SendDriverRequestAgainCommand($original->id, true, 'again'));

        $again = DriverRequest::query()->findOrFail($againId);
        $this->assertSame([$againId, $original->id], [$repeated, $again->possible_duplicate_of_id]);
        $this->assertEquals($original->partList, $again->partList);
        $this->assertSame(RequestProgress::DeliveryUncertain, $original->fresh()?->progress);
    }

    public function test_an_agent_names_its_running_session_by_the_label_and_model_it_launched_on(): void
    {
        [, $opened] = $this->openRuntime();
        $runtime = AgentRuntime::query()->findOrFail($opened->runtimeId);

        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser('owner'), new OwnerAuthority('test'));
        $option = $this->app->make(AgentDirectory::class)->visibleAgent($this->agentIdOf($opened));

        $this->assertSame($runtime->driver_label, $option->sessionDriverLabel);
        $this->assertSame(AgentSession::query()->findOrFail($opened->sessionId)->model, $option->sessionModel);
    }

    private function numberedReport(string $hostId, string $requestId, RequestProgress $progress, int $sequence): void
    {
        $request = DriverRequest::query()->findOrFail($requestId);
        $runtime = AgentRuntime::query()->findOrFail($request->agent_runtime_id);

        $this->asSystem(new ReportRequestProgressCommand(
            $hostId,
            $request->id,
            $request->attempt_version,
            $progress,
            null,
            null,
            binding: new RequestReportBinding($runtime->agent_session_id, null, $runtime->process_generation),
            sequence: $sequence,
        ));
    }

    /**
     * Attachments that can all be read but the one named.
     */
    private function attachmentsExcept(string $missing): AttachmentReferences
    {
        return new readonly class($missing) implements AttachmentReferences
        {
            public function __construct(private string $missing) {}

            public function assertReadable(MessageAttachmentData $part, string $recipientSessionId): void
            {
                if ($part->attachmentId === $this->missing) {
                    throw DriverRequestRefused::attachmentMissing($part->attachmentId);
                }
            }
        };
    }

    /**
     * How many times the runtime's wakes were asked for, over all its wake requests.
     */
    private function wakesAskedOf(OpenedRuntime $opened): int
    {
        return (int) DriverRequest::query()
            ->where('agent_runtime_id', $opened->runtimeId)
            ->where('operation', DriverOperation::Wake)
            ->sum('wake_requested');
    }

    private function secondRuntimeOn(EnrolledHost $host): OpenedRuntime
    {
        return $this->asOwner(new OpenAgentRuntimeCommand(
            Agent::create('Second agent', 'main-agent')->id,
            $host->hostId,
            self::FOLDER,
            'claude-code',
            '2.1.323',
            'claude',
            DriverType::Headless,
            'claude-opus-5-5',
        ));
    }

    private function silenceSince(OpenedRuntime $opened, CarbonImmutable $since): void
    {
        AgentSession::query()->whereKey($opened->sessionId)->update([
            'status' => SessionStatus::Silent->value,
            'silent_since' => $since,
            'last_heartbeat_at' => $since->subMinutes(5),
        ]);
    }

    private function deliver(OpenedRuntime $opened, string $key, string $message): DriverReceipt
    {
        return $this->asOwner(DeliverAgentCommand::text($this->agentIdOf($opened), $opened->sessionId, $key, $message));
    }

    /**
     * The host's report of a request: staged without a turn's end, or the turn's end as the host saw it.
     *
     * @param  array<string, int|string|bool>|null  $turnEnd
     */
    private function reportTurnEnd(EnrolledHost $host, string $requestId, array|null $turnEnd): void
    {
        $request = DriverRequest::query()->findOrFail($requestId);
        $report = ['request_id' => $request->id, 'attempt' => $request->attempt_version, 'actual_binding' => null];

        $this->hostCall(
            $host,
            '/host/reports/request',
            $turnEnd === null ? [...$report, 'progress' => 'staged'] : [...$report, 'turn_end' => $turnEnd],
        )->assertSuccessful();
    }

    private function reportProgress(string $hostId, string $requestId, RequestProgress $progress): void
    {
        $request = DriverRequest::query()->findOrFail($requestId);

        $this->asSystem(new ReportRequestProgressCommand(
            $hostId,
            $request->id,
            $request->attempt_version,
            $progress,
            null,
            RequestOutcome::EntryUnavailable,
            refusal: HostWakeRefusal::ContainerUnavailable,
            noProcessCreated: true,
        ));
    }
}
