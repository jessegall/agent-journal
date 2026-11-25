<?php

declare(strict_types=1);

namespace Tests\Commands\Drivers;

use App\Commands\Agents\DeliverAgent\DeliverAgentCommand;
use App\Commands\Agents\NotifyRuntimeExit\NotifyRuntimeExitCommand;
use App\Commands\Agents\StopAgent\StopAgentCommand;
use App\Commands\Drivers\ClaimDriverRequests\ClaimDriverRequestsCommand;
use App\Commands\Drivers\NotifyRequestProgress\NotifyRequestProgressCommand;
use App\Commands\Sessions\ClaimStartGrant\ClaimStartGrantCommand;
use App\Commands\Terminals\CancelKeyScript\CancelKeyScriptCommand;
use App\Commands\Terminals\ResumeKeyScript\ResumeKeyScriptCommand;
use App\Contracts\Actors\AgentTexts;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Sessions\AgentDirectory;
use App\Enums\Agents\ConversationModeType;
use App\Enums\Agents\ExecutionModeType;
use App\Enums\Drivers\DriverType;
use App\Enums\Drivers\HoldReason;
use App\Enums\Drivers\HostWakeRefusal;
use App\Enums\Drivers\RequestOutcome;
use App\Enums\Drivers\RequestProgress;
use App\Enums\Projects\ArrangementType;
use App\Enums\Sessions\HostRefusal;
use App\Enums\Sessions\SessionStatus;
use App\Enums\Sessions\StartOriginType;
use App\Enums\Sessions\StartReadiness;
use App\Exceptions\HostReportRefused;
use App\Models\Accounts\Account;
use App\Models\Accounts\ActiveAccount;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Drivers\DriverRequest;
use App\Models\Drivers\RuntimeEvent;
use App\Models\Projects\Host;
use App\Models\Sessions\SessionPolicy;
use App\Models\Sessions\SessionRequest;
use App\Support\ActorReference;
use App\Support\AgentStatus;
use App\Support\AgentWakes;
use App\Support\ArrangementSetting;
use App\Support\DefaultDrivers;
use App\Support\EnrolledHost;
use App\Support\InitialWakeSettlement;
use App\Support\OpenedRuntime;
use App\Support\StartProfiles;
use App\Values\AccountLabel;
use App\Values\AgentText;
use App\Values\BrowserInputCapabilities;
use App\Values\ClaimedRequest;
use App\Values\DriverReceipt;
use App\Values\ExecutionBudgets;
use App\Values\ExecutionPolicy;
use App\Values\OwnerAuthority;
use App\Values\ProfileBase;
use App\Values\ProfileStartPolicy;
use App\Values\RequestReportBinding;
use App\Values\ScriptProgress;
use App\Values\StackTarget;
use App\Values\StartPolicy;
use App\Values\StartRequest;
use App\Values\StopConditions;
use PhpOption\None;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\Agents\HostContract;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * A host reports how far a request got: a staged report gives the request back after a wait, the host's facts hold a
 * runtime for attention, an applied stop keeps stopping until its exit is proved, and a stopped key script resumes from
 * its step or is cancelled.
 */
#[TestsCommand(NotifyRequestProgressCommand::class)]
final class NotifyRequestProgressTest extends TestCase
{
    use CommitsHookRows;
    use OpensLedgerRuntimes;

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
        'session_requests',
        'runtime_events',
    ];

    /**
     * A host that could not start a turn, such as a prompt its screen did not let in, reports it staged and tries no
     * more: the journal takes the request back and offers it again once its wait has passed.
     */
    private const string CONVERSATION = 'conversation-1';

    public function test_a_staged_report_gives_the_request_back_to_be_offered_again_after_a_wait(): void
    {
        [$host, $opened] = $this->openRuntime(firstMessage: 'Behind a menu');
        $this->journal->asSystem(new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()));

        $this->notifyProgress($host->hostId, $opened->firstRequestId, RequestProgress::Staged);

        $this->assertSame(
            RequestProgress::Accepted,
            DriverRequest::query()->findOrFail($opened->firstRequestId)->progress,
        );
        $tooSoon = $this->journal->asSystem(
            new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()),
        );
        $this->assertSame([], $tooSoon->requests);

        $this->travel(3)->seconds();
        $again = $this->journal->asSystem(
            new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()),
        );

        $this->assertSame(
            [$opened->firstRequestId],
            array_map(fn ($request): string => $request->requestId, $again->requests),
        );
    }

    /**
     * The host reports plain facts and the journal chooses the hold: an account that is not signed in, and a stop the
     * host could not prove, each leave the runtime needing attention.
     */
    public function test_the_journal_holds_a_runtime_for_attention_from_the_hosts_facts(): void
    {
        [$host, $signedOut] = $this->openRuntime(firstMessage: 'Signed out');
        $this->journal->asSystem(new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()));
        $wake = DriverRequest::query()->findOrFail($signedOut->firstRequestId);
        $this->journal->asSystem(new NotifyRequestProgressCommand(
            $host->hostId,
            $wake->id,
            $wake->attempt_version,
            RequestProgress::Failed,
            null,
            RequestOutcome::Refused,
            refusal: HostWakeRefusal::NotSignedIn,
            hasCreatedNoProcess: true,
        ));

        [$stopHost, $stopped] = $this->openRuntime();
        $stop = $this->asOwner(new StopAgentCommand($this->agentIdOf($stopped), $stopped->sessionId, 'stop-1'));
        $this->journal->asSystem(
            new ClaimDriverRequestsCommand($stopHost->hostId, 10, BrowserInputCapabilities::none()),
        );
        $this->journal->asSystem(new NotifyRequestProgressCommand(
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

    public function test_an_applied_stop_keeps_stopping_until_the_exit_of_its_generation_is_proved(): void
    {
        [$host, $opened] = $this->openRuntime();
        $agentId = $this->agentIdOf($opened);
        $runtime = AgentRuntime::query()->findOrFail($opened->runtimeId);
        $stop = $this->asOwner(
            new StopAgentCommand($agentId, $opened->sessionId, 'stop-1', $runtime->process_generation),
        );
        $this->journal->asSystem(new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()));
        $this->notifyProgress($host->hostId, $stop->requestId, RequestProgress::Applied);

        $this->assertSame('Stopping', $this->statusOf($agentId)->label);

        $this->assertThrows(
            fn () => $this->journal->asSystem(
                new NotifyRuntimeExitCommand(
                    $host->hostId,
                    $opened->runtimeId,
                    $runtime->process_generation - 1,
                    'old exit',
                ),
            ),
            HostReportRefused::class,
        );
        $this->assertSame(SessionStatus::Active, AgentSession::query()->findOrFail($opened->sessionId)->status);

        $this->notifyExit($host, $opened);

        $this->assertSame('Stopped', $this->statusOf($agentId)->label);
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
            $this->journal->asSystem(new NotifyRequestProgressCommand(
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

    public function test_a_message_sent_during_startup_goes_out_once_after_the_bootstrap_proves_its_conversation(): void
    {
        [$host, $opened, $wake, $record] = $this->startWithMessage();

        $this->assertSame([$wake->id], $this->claimedIds($host));
        $this->assertSame(StartReadiness::PreparingIdentity, $record->refresh()->readiness);

        $this->notifyApplied($host, $wake, self::CONVERSATION);

        $this->assertSame([$opened->firstRequestId], $this->claimedIds($host));
        $this->assertSame([], $this->claimedIds($host));
        $this->assertSame(
            [StartReadiness::Ready, self::CONVERSATION],
            [$record->refresh()->readiness, $record->native_id],
        );
    }

    public function test_only_the_initial_wake_of_a_preparing_start_is_claimed_as_its_bootstrap(): void
    {
        [$host, $opened, $wake] = $this->startWithMessage();

        $bootstrap = $this->claimed($host);
        $this->notifyApplied($host, $wake, self::CONVERSATION);
        $after = $this->claimed($host);

        $pendingWork = $this->app->make(AgentTexts::class)->render(AgentText::of('core.drivers.pending_work'));
        $this->assertSame(
            [[$wake->id, true, $pendingWork]],
            array_map(
                fn (ClaimedRequest $request) => [$request->requestId, $request->shouldBootstrap, $request->message],
                $bootstrap,
            ),
        );
        $this->assertSame(
            [[$opened->firstRequestId, false]],
            array_map(fn (ClaimedRequest $request) => [$request->requestId, $request->shouldBootstrap], $after),
        );
    }

    public function test_a_failed_bootstrap_leaves_the_start_holding_its_message(): void
    {
        [$host, $opened, $wake, $record] = $this->startWithMessage();
        $this->claimedIds($host);
        $wake->refresh();

        $this->journal->asSystem(new NotifyRequestProgressCommand(
            $host->hostId,
            $wake->id,
            $wake->attempt_version,
            RequestProgress::Failed,
            null,
            null,
        ));

        $this->assertNotSame(StartReadiness::Ready, $record->refresh()->readiness);
        $this->assertNotContains($opened->firstRequestId, $this->claimedIds($host));
        $this->assertSame(
            RequestProgress::Accepted,
            DriverRequest::query()->findOrFail($opened->firstRequestId)->progress,
        );
    }

    public function test_another_conversation_refuses_the_start_and_the_message_stays_held(): void
    {
        [$host, $opened, $wake, $record] = $this->startWithMessage();
        $record->bindIdentity(self::CONVERSATION);
        $record->markIdentityUncertain();
        $this->claimedIds($host);

        $this->notifyApplied($host, $wake, 'conversation-2');

        $this->assertSame(
            [StartReadiness::Refused, HostRefusal::IdentityMismatch->value],
            [$record->refresh()->readiness, $record->refusal_reason],
        );
        $this->assertSame([], $this->claimedIds($host));
        $this->assertSame(
            RequestProgress::Accepted,
            DriverRequest::query()->findOrFail($opened->firstRequestId)->progress,
        );
    }

    public function test_a_bootstrap_report_after_the_start_was_refused_changes_nothing(): void
    {
        [$host, , $wake, $record] = $this->startWithMessage();
        $this->claimedIds($host);
        $record->refuseFor(HostRefusal::IdentityMismatch);

        $this->notifyApplied($host, $wake, self::CONVERSATION);

        $this->assertSame([StartReadiness::Refused, null], [$record->refresh()->readiness, $record->native_id]);
        $this->assertSame([], $this->claimedIds($host));
    }

    public function test_a_protected_headless_start_runs_on_the_messages_both_sides_keep(): void
    {
        [$host, $fixedValues] = $this->claimedProtectedStart();

        // What the host's scenario reports once the turn ran in its container: the journal keeps the conversation whole.
        $applied = HostContract::of('host-start/protected-headless-claude/request-report.json')->readFor($fixedValues);
        $this->journal->hostCall($host, 'POST', '/host/reports/request', $applied)->assertSuccessful();

        $request = DriverRequest::query()->findOrFail($applied['request_id']);
        $this->assertSame(RequestProgress::Applied, $request->progress);
        $this->assertSame($applied['actual_binding'], $request->actual_binding);
    }

    public function test_a_protected_start_the_host_refused_ends_its_session_with_the_reason(): void
    {
        [$host, $fixedValues] = $this->claimedProtectedStart();

        // What the host's scenario reports when it cannot carry the start out: the session ends, saying why.
        $refused = HostContract::of('host-start/protected-headless-claude/request-report-refused.json')->readFor($fixedValues);
        $this->journal->hostCall($host, 'POST', '/host/reports/request', $refused)->assertSuccessful();

        $request = DriverRequest::query()->findOrFail($refused['request_id']);
        $session = AgentSession::query()->findOrFail(array_search('01contractsession000000000', $fixedValues, true));
        $this->assertTrue($request->progress->isRefused());
        $this->assertStringContainsString($request->refusal_reason->value, (string) $session->end_evidence);
    }

    public function test_a_numbered_report_sent_again_is_taken_once(): void
    {
        [$host, $opened] = $this->openRuntime();
        $receipt = $this->deliver($opened, 'replayed', 'Read the notes');
        $this->journal->asSystem(new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()));

        $this->numberedReport($host->hostId, $receipt->requestId, RequestProgress::Applying, 1);
        $this->numberedReport($host->hostId, $receipt->requestId, RequestProgress::Applied, 2);
        $this->numberedReport($host->hostId, $receipt->requestId, RequestProgress::Applying, 1);

        $this->assertSame(RequestProgress::Applied, DriverRequest::query()->findOrFail($receipt->requestId)->progress);
        $this->assertSame(2, RuntimeEvent::query()->where('agent_runtime_id', $opened->runtimeId)->count());
    }

    private function statusOf(string $agentId): AgentStatus
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorReference::forUser('owner'), new OwnerAuthority('test'));

        return $this->app->make(AgentDirectory::class)->visibleAgent($agentId)->status;
    }

    private function notifyExit(EnrolledHost $host, OpenedRuntime $opened): void
    {
        $generation = AgentRuntime::query()->findOrFail($opened->runtimeId)->process_generation;

        $this->journal->asSystem(
            new NotifyRuntimeExitCommand($host->hostId, $opened->runtimeId, $generation, 'exit code 0'),
        );
    }

    private function notifyProgress(string $hostId, string $requestId, RequestProgress $progress): void
    {
        $request = DriverRequest::query()->findOrFail($requestId);

        $this->journal->asSystem(new NotifyRequestProgressCommand(
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

    private function startWithMessage(): array
    {
        [$host, $opened] = $this->openRuntime(firstMessage: 'Start with the plan.');
        $session = AgentSession::query()->findOrFail($opened->sessionId);
        $request = new StartRequest(
            TestSelections::requestId(),
            $session->agent_id,
            TestSelections::of(),
            StartOriginType::MainStart,
            null,
            null,
            ConversationModeType::New,
            null,
            StartPolicy::withoutProfile(TestSelections::onHost()),
            driverType: DriverType::Headless,
        );
        $record = SessionRequest::create(
            $request,
            TestSelections::pinOf($request),
            ActorReference::system(),
            None::create(),
        );
        $record->startedAs($session);
        $receipt = $this->app->make(AgentWakes::class)->wake(
            new StackTarget($session->agent_id, $session->id),
            InitialWakeSettlement::keyOf($session->id),
        );

        return [$host, $opened, DriverRequest::query()->findOrFail($receipt->requestId), $record];
    }

    /**
     * @return list<ClaimedRequest>
     */
    private function claimed(EnrolledHost $host): array
    {
        return $this->journal->asSystem(
            new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()),
        )->requests;
    }

    /**
     * @return list<string>
     */
    private function claimedIds(EnrolledHost $host): array
    {
        return array_map(fn (ClaimedRequest $request) => $request->requestId, $this->claimed($host));
    }

    private function notifyApplied(EnrolledHost $host, DriverRequest $wake, string $conversation): void
    {
        $wake->refresh();
        $this->journal->asSystem(new NotifyRequestProgressCommand(
            $host->hostId,
            $wake->id,
            $wake->attempt_version,
            RequestProgress::Applying,
            null,
            null,
        ));
        $this->journal->asSystem(new NotifyRequestProgressCommand(
            $host->hostId,
            $wake->id,
            $wake->attempt_version,
            RequestProgress::Applied,
            $conversation,
            null,
        ));
    }

    private function deliver(OpenedRuntime $opened, string $key, string $message): DriverReceipt
    {
        return $this->asOwner(DeliverAgentCommand::text($this->agentIdOf($opened), $opened->sessionId, $key, $message));
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
        $account = Account::create(
            DefaultDrivers::CLAUDE_CODE,
            AccountLabel::from('Plain'),
            '/journal/accounts/01plain',
        );
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
            new StartPolicy(
                ProfileBase::mainAgent()->defaultAccess(),
                new StopConditions([]),
                $execution,
                null,
                null,
                null,
            ),
        );

        $fixedValues = [
            $opened->sessionId => '01contractsession000000000',
            $opened->runtimeId => '01contractruntime000000000',
        ];
        $claimed = $this->journal->hostCall(
            $host,
            'POST',
            '/host/claim?limit=10&wait=0&watched_version=0&arrangement=contained',
            [],
        )->assertSuccessful();
        $fixedValues[(string) $claimed->json('requests.0.requestId')] = '01contractrequest000000000';
        $fixedValues[(string) $claimed->json('requests.0.sessionProcessId')] = '01contractstart00000000000';

        HostContract::of('host-start/protected-headless-claude/requests.json')->assertHolds(
            (array) $claimed->json(),
            $fixedValues,
        );

        $grant = $this->journal->asSystem(new ClaimStartGrantCommand($host->hostId, $opened->runtimeId));

        HostContract::of('host-start/protected-headless-claude/grant.json')->assertHolds($grant->toArray(), [
            $grant->toArray()['token'] => 'contract-token',
            $grant->toArray()['offline_reply_seal'] => 'contract-seal',
            $opened->sessionId => '01contractsession000000000',
        ]);

        // What the host's own scenario sends about the agent image: every item has its mechanism and awaits its run.
        $report = HostContract::of('host-start/protected-headless-claude/protection-report.json')->read();
        $this->journal->hostCall($host, 'POST', '/host/reports/protection', $report)->assertSuccessful();
        $claim = $this->journal->hostCall(
            $host,
            'POST',
            '/host/starts/claim',
            ['session_id' => $opened->sessionId],
        )->assertSuccessful();

        HostContract::of('host-start/protected-headless-claude/claim.json')->assertHolds((array) $claim->json(), [
            (string) $claim->json('start_key') => 'contract-start-key',
            $opened->sessionId => '01contractsession000000000',
            $account->id => '01contractaccount000000000',
        ]);

        return [$host, $fixedValues];
    }

    private function numberedReport(string $hostId, string $requestId, RequestProgress $progress, int $sequence): void
    {
        $request = DriverRequest::query()->findOrFail($requestId);
        $runtime = AgentRuntime::query()->findOrFail($request->agent_runtime_id);

        $this->journal->asSystem(new NotifyRequestProgressCommand(
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
}
