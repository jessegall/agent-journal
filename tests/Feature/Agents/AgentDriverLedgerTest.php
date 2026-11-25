<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Commands\Agents\ChangeAgentEffort\ChangeAgentEffortCommand;
use App\Commands\Agents\ChangeAgentModel\ChangeAgentModelCommand;
use App\Commands\Agents\DeliverAgent\DeliverAgentCommand;
use App\Commands\Agents\InterruptAgent\InterruptAgentCommand;
use App\Commands\Agents\NotifyRuntimeExit\NotifyRuntimeExitCommand;
use App\Commands\Agents\NotifyRuntimeHeartbeat\NotifyRuntimeHeartbeatCommand;
use App\Commands\Agents\OpenAgentRuntime\OpenAgentRuntimeCommand;
use App\Commands\Agents\RetireAgent\RetireAgentCommand;
use App\Commands\Agents\StopAgent\StopAgentCommand;
use App\Commands\Agents\WakeAgent\WakeAgentCommand;
use App\Commands\Drivers\ClaimDriverRequests\ClaimDriverRequestsCommand;
use App\Commands\Drivers\NotifyRequestProgress\NotifyRequestProgressCommand;
use App\Commands\Drivers\NotifyRuntimeActivity\NotifyRuntimeActivityCommand;
use App\Commands\Drivers\RetryDriverRequest\RetryDriverRequestCommand;
use App\Commands\Sessions\ClaimStartGrant\ClaimStartGrantCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Drivers\AttachmentReferences;
use App\Contracts\Drivers\MessagePart;
use App\Contracts\Sessions\AgentDirectory;
use App\Contracts\Sessions\RuntimeResolver;
use App\Data\Messages\MessageAttachmentData;
use App\Data\Messages\MessageTextData;
use App\Enums\Agents\ExecutionModeType;
use App\Enums\Drivers\DriverOperation;
use App\Enums\Drivers\DriverType;
use App\Enums\Drivers\HoldReason;
use App\Enums\Drivers\HostWakeRefusal;
use App\Enums\Drivers\RequestOutcome;
use App\Enums\Drivers\RequestProgress;
use App\Enums\Projects\ArrangementType;
use App\Enums\Runs\RuntimeActivity;
use App\Enums\Sessions\HostRefusal;
use App\Enums\Sessions\SessionStatus;
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
use App\Models\Drivers\DriverRequest;
use App\Models\Drivers\DriverTurn;
use App\Models\Drivers\RuntimeEvent;
use App\Models\Projects\Host;
use App\Models\Sessions\SessionPolicy;
use App\Models\Sessions\SessionProcess;
use App\Support\ActorContext;
use App\Support\AgentStatus;
use App\Support\ArrangementSetting;
use App\Support\DefaultDrivers;
use App\Support\DriverBudgets;
use App\Support\EnrolledHost;
use App\Support\InitialWakeSettlement;
use App\Support\NativeTurnRecords;
use App\Support\OpenedRuntime;
use App\Support\OutsideCommandAllowance;
use App\Support\StartHeartbeats;
use App\Support\StartProfiles;
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
use Illuminate\Support\Str;
use Spatie\LaravelData\Optional;
use Tests\Support\Agents\HostContract;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\OpensPairChats;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsHostCalls;
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
    ];

    private const string FOLDER = '/work/project';

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
            $this->notifyTurnEnd($host, $setting->requestId, null);
        }

        $this->assertSame(RequestProgress::Staged, DriverRequest::query()->findOrFail($model->requestId)->progress);

        foreach ([$model, $effort] as $setting) {
            $this->notifyTurnEnd($host, $setting->requestId, ['exit_code' => 0, 'model' => 'claude-sonnet-5-5']);
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
            'turn_end' => ['exit_code' => 0, 'is_result_read' => true, 'result_subtype' => 'error_during_execution'],
        ])->assertSuccessful();

        $this->assertSame(
            [RequestProgress::Failed, RequestOutcome::TurnFailed],
            [$request->fresh()?->progress, $request->fresh()?->outcome],
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

    public function test_a_protected_headless_start_runs_on_the_messages_both_sides_keep(): void
    {
        [$host, $fixedValues] = $this->claimedProtectedStart();

        // What the host's scenario reports once the turn ran in its container: the journal keeps the conversation whole.
        $applied = HostContract::of('host-start/protected-headless-claude/request-report.json')->readFor($fixedValues);
        $this->hostCall($host, '/host/reports/request', $applied)->assertSuccessful();

        $request = DriverRequest::query()->findOrFail($applied['request_id']);
        $this->assertSame(RequestProgress::Applied, $request->progress);
        $this->assertSame($applied['actual_binding'], $request->actual_binding);
    }

    public function test_a_protected_start_the_host_refused_ends_its_session_with_the_reason(): void
    {
        [$host, $fixedValues] = $this->claimedProtectedStart();

        // What the host's scenario reports when it cannot carry the start out: the session ends, saying why.
        $refused = HostContract::of('host-start/protected-headless-claude/request-report-refused.json')->readFor($fixedValues);
        $this->hostCall($host, '/host/reports/request', $refused)->assertSuccessful();

        $request = DriverRequest::query()->findOrFail($refused['request_id']);
        $session = AgentSession::query()->findOrFail(array_search('01contractsession000000000', $fixedValues, true));
        $this->assertTrue($request->progress->isRefused());
        $this->assertStringContainsString($request->refusal_reason->value, (string) $session->end_evidence);
    }

    /**
     * A protected headless start on a contained host, walked on the journal's side up to the host's claim, each
     * message held to the contract the host's scenarios read: the host and the run's ids under their fixed values.
     *
     * @return array{0: EnrolledHost, 1: array<string, string>}
     */
    private function claimedProtectedStart(): array
    {
        config(['agents.protected_account_trial' => DefaultDrivers::CLAUDE_CODE]);
        $account = Account::create(DefaultDrivers::CLAUDE_CODE, AccountLabel::from('Plain'), '/journal/accounts/01plain');
        ActiveAccount::findLockedFor(DefaultDrivers::CLAUDE_CODE)->select($account);
        [$host, $opened] = $this->openRuntime('Say hello');
        // The host is a contained one, as the installation's arrangement below says.
        Host::query()->findOrFail($host->hostId)->forceFill(['arrangement' => ArrangementType::Contained])->save();
        $this->app->instance(
            ArrangementSetting::class,
            ArrangementSetting::fromConfig('contained', 'acme', '{"main":{"folder":"main"}}'),
        );
        $this->app->forgetInstance(StartProfiles::class);
        $execution = new ExecutionPolicy(
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
            new StartPolicy(ProfileBase::mainAgent()->defaultAccess(), new StopConditions([]), $execution, null, null, null),
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
        $fixedValues[(string) $claimed->json('requests.0.sessionProcessId')] = '01contractstart00000000000';

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

        return [$host, $fixedValues];
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
        $execution = new ExecutionPolicy(
            ExecutionModeType::RequiredContainer,
            'journal-agent@sha256:'.str_repeat('a', 64),
            ProfileStartPolicy::WORKSPACE,
            ExecutionBudgets::mainAgent(),
            [],
            ProfileBase::mainAgent()->isAttachable(),
        );

        $this->assertTrue($execution->forDriverScreen(true)->isAttachable);
        $this->assertFalse($execution->forDriverScreen(false)->isAttachable);
    }

    public function test_helpers_are_never_attachable(): void
    {
        $this->assertTrue(ProfileBase::mainAgent()->isAttachable());
        $this->assertFalse(ProfileBase::readOnlyHelper()->isAttachable());
        $this->assertFalse(ProfileBase::writingHelper()->isAttachable());
    }

    public function test_a_session_long_silent_while_its_host_beats_for_another_is_ended_as_unserved(): void
    {
        [$host, $served] = $this->openRuntime();
        $unserved = $this->secondRuntimeOn($host);
        AgentSession::query()->whereKey($served->sessionId)->update(['last_heartbeat_at' => CarbonImmutable::now()]);
        $this->silenceSince($unserved, CarbonImmutable::now()->subMinutes(11));

        $this->app->make(StartHeartbeats::class)->markSilentStarts();

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

        $this->app->make(StartHeartbeats::class)->markSilentStarts();

        $this->assertSame(SessionStatus::Silent, AgentSession::query()->findOrFail($opened->sessionId)->status);
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
            new NotifyRuntimeHeartbeatCommand($host->hostId, $opened->runtimeId, $generation, 'owned process alive'),
        );

        $this->assertNotNull(AgentSession::query()->findOrFail($opened->sessionId)->last_heartbeat_at);
    }

    public function test_a_heartbeat_of_a_restarted_program_is_taken_and_one_of_a_replaced_generation_is_refused(): void
    {
        [$host, $opened] = $this->openRuntime();
        $generation = AgentRuntime::query()->findOrFail($opened->runtimeId)->process_generation;

        $this->asSystem(new NotifyRuntimeHeartbeatCommand($host->hostId, $opened->runtimeId, $generation + 1, 'restarted'));

        $this->assertNotNull(AgentSession::query()->findOrFail($opened->sessionId)->last_heartbeat_at);
        $this->assertThrows(
            fn () => $this->asSystem(
                new NotifyRuntimeHeartbeatCommand($host->hostId, $opened->runtimeId, $generation - 1, 'replaced'),
            ),
            HostReportRefused::class,
        );
    }

    public function test_a_verified_exit_ends_the_session(): void
    {
        [$host, $opened] = $this->openRuntime();
        $generation = AgentRuntime::query()->findOrFail($opened->runtimeId)->process_generation;

        $this->asSystem(new NotifyRuntimeExitCommand($host->hostId, $opened->runtimeId, $generation, 'exit code 0'));

        $this->assertSame(SessionStatus::Ended, AgentSession::query()->findOrFail($opened->sessionId)->status);
    }

    public function test_a_confirmed_stop_ends_the_session_revokes_it_and_leaves_no_request_open(): void
    {
        [$host, $opened] = $this->openRuntime();
        $this->deliver($opened, 'before-stop', 'Never delivered');
        $this->asOwner(new StopAgentCommand($this->agentIdOf($opened), $opened->sessionId, 'stop-1'));

        $this->notifyExit($host, $opened);

        $session = AgentSession::query()->with('sessionToken')->findOrFail($opened->sessionId);
        $requests = DriverRequest::query()->where('agent_runtime_id', $opened->runtimeId)->get();
        $this->assertSame(SessionStatus::Ended, $session->status);
        $this->assertTrue($session->sessionToken?->isRevoked());
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
        $this->notifyExit($host, $opened);

        $this->expectException(DriverRequestRefused::class);

        $this->asOwner(new WakeAgentCommand($this->agentIdOf($opened), $opened->sessionId, 'wake-after-exit'));
    }

    public function test_a_refused_message_wake_keeps_the_session_its_credentials_and_its_start(): void
    {
        [$host, $opened] = $this->openRuntime();
        $wake = $this->asOwner(new WakeAgentCommand($this->agentIdOf($opened), $opened->sessionId, 'message-wake'));
        $claimed = $this->claimedScript($host, $wake->requestId);

        $this->notifyWakeRefused($host, $claimed, 'container-unavailable', true);

        $session = AgentSession::query()->findOrFail($opened->sessionId);
        $this->assertSame(SessionStatus::Active, $session->status);
        $this->assertNull(SessionProcess::findLatestOfSession($opened->sessionId)?->refusal);
        $this->assertSame(RequestProgress::Failed, DriverRequest::query()->findOrFail($wake->requestId)->progress);
    }

    public function test_a_proved_unstarted_initial_wake_ends_the_start_once_with_its_reason(): void
    {
        [$host, $opened] = $this->openRuntime();
        $wake = $this->asOwner(new WakeAgentCommand(
            $this->agentIdOf($opened),
            $opened->sessionId,
            InitialWakeSettlement::keyOf($opened->sessionId),
        ));
        $claimed = $this->claimedScript($host, $wake->requestId);

        $this->notifyWakeRefused($host, $claimed, 'container-unavailable', true);
        $this->notifyWakeRefused($host, $claimed, 'container-unavailable', true);

        $session = AgentSession::query()->findOrFail($opened->sessionId);
        $start = SessionProcess::findLatestOfSession($opened->sessionId);
        $this->assertSame(SessionStatus::Ended, $session->status);
        $this->assertSame(self::NO_CONTAINER, $start?->refusal);
    }

    public function test_a_generic_refusal_of_the_initial_wake_keeps_the_start_for_reconciliation(): void
    {
        [$host, $opened] = $this->openRuntime();
        $wake = $this->asOwner(new WakeAgentCommand(
            $this->agentIdOf($opened),
            $opened->sessionId,
            InitialWakeSettlement::keyOf($opened->sessionId),
        ));
        $claimed = $this->claimedScript($host, $wake->requestId);

        $this->notifyWakeRefused($host, $claimed, null, false);

        $this->assertSame(SessionStatus::Active, AgentSession::query()->findOrFail($opened->sessionId)->status);
        $this->assertNull(SessionProcess::findLatestOfSession($opened->sessionId)?->refusal);
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

        $this->notifyExit($host, $opened);

        $this->assertSame(SessionStatus::Ended, AgentSession::query()->findOrFail($opened->sessionId)->status);
        $this->assertSame(RequestProgress::Applied, $stop->fresh()?->progress);
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
                'has_created_no_process' => true,
                'session_id' => $claimed['sessionId'],
                'session_process_id' => $claimed['sessionProcessId'],
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
        $this->notifyExit($helperHost, $helper);

        $mainClaim = $this->asSystem(new ClaimDriverRequestsCommand($mainHost->hostId, 10, BrowserInputCapabilities::none()));
        $this->assertSame(
            [DriverOperation::Stop->value],
            array_map(fn ($request) => $request->operation, $mainClaim->requests),
        );
        $this->assertSame(SessionStatus::Active, AgentSession::query()->findOrFail($main->sessionId)->status);
        $this->assertSame(RequestProgress::Applied, $stopOf($helper)->progress);
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
            new NotifyRuntimeActivityCommand($host->hostId, $opened->runtimeId, RuntimeActivity::Running, HoldReason::None, 3),
        );

        $this->expectException(StaleProcessGeneration::class);

        $this->app->make(NativeTurnRecords::class)->checkGeneration($opened->sessionId, 2);
    }

    public function test_each_native_prompt_id_makes_one_turn_inside_a_unit_of_its_own(): void
    {
        [, $opened] = $this->openRuntime();
        $turns = $this->app->make(NativeTurnRecords::class);
        // A hook records its prompt's turn outside any command, as the real app forbids.
        $this->app->make(OutsideCommandAllowance::class)->forbid();

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
            new NotifyRequestProgressCommand(
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
    private function notifyWakeRefused(
        EnrolledHost $host,
        array $claimed,
        string|null $reason,
        bool $hasCreatedNoProcess,
    ): void {
        $this->hostCall($host, '/host/reports/request', [
            'request_id' => $claimed['requestId'],
            'attempt' => $claimed['attempt'],
            'progress' => 'failed',
            'actual_binding' => null,
            'outcome' => 'refused',
            'refusal_reason' => $reason,
            'has_created_no_process' => $hasCreatedNoProcess,
            'session_id' => $claimed['sessionId'],
            'session_process_id' => $claimed['sessionProcessId'],
            'process_generation' => $claimed['processGeneration'],
        ])->assertSuccessful();
    }

    private function statusOf(string $agentId): AgentStatus
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser('owner'), new OwnerAuthority('test'));

        return $this->app->make(AgentDirectory::class)->visibleAgent($agentId)->status;
    }

    private function notifyExit(EnrolledHost $host, OpenedRuntime $opened): void
    {
        $generation = AgentRuntime::query()->findOrFail($opened->runtimeId)->process_generation;

        $this->asSystem(new NotifyRuntimeExitCommand($host->hostId, $opened->runtimeId, $generation, 'exit code 0'));
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

        $this->asSystem(new NotifyRuntimeActivityCommand(
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
        $this->notifyProgress($host->hostId, $receipt->requestId, RequestProgress::Failed);
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
        $this->asSystem(new NotifyRequestProgressCommand(
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

    public function test_an_agent_names_its_running_session_by_the_label_and_model_it_started_on(): void
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

        $this->asSystem(new NotifyRequestProgressCommand(
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
            Agent::create('Second agent', 'main-agent', $this->localProject())->id,
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
    private function notifyTurnEnd(EnrolledHost $host, string $requestId, array|null $turnEnd): void
    {
        $request = DriverRequest::query()->findOrFail($requestId);
        $report = ['request_id' => $request->id, 'attempt' => $request->attempt_version, 'actual_binding' => null];

        $this->hostCall(
            $host,
            '/host/reports/request',
            $turnEnd === null ? [...$report, 'progress' => 'staged'] : [...$report, 'turn_end' => $turnEnd],
        )->assertSuccessful();
    }

    private function notifyProgress(string $hostId, string $requestId, RequestProgress $progress): void
    {
        $request = DriverRequest::query()->findOrFail($requestId);

        $this->asSystem(new NotifyRequestProgressCommand(
            $hostId,
            $request->id,
            $request->attempt_version,
            $progress,
            null,
            RequestOutcome::EntryUnavailable,
            refusal: HostWakeRefusal::ContainerUnavailable,
            hasCreatedNoProcess: true,
        ));
    }
}
