<?php

declare(strict_types=1);

namespace Tests\Commands\Drivers;

use App\Access\Values\OwnerAuthority;
use App\Actors\Contracts\AgentTexts;
use App\Actors\Contracts\CurrentActorSetter;
use App\Agents\Commands\DeliverAgent\DeliverAgentCommand;
use App\Agents\Commands\NotifyRuntimeExit\NotifyRuntimeExitCommand;
use App\Agents\Commands\StopAgent\StopAgentCommand;
use App\Agents\Drivers\Commands\NotifyRequestProgress\NotifyRequestProgressCommand;
use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Enums\DriverType;
use App\Agents\Drivers\Enums\HoldReason;
use App\Agents\Drivers\Enums\HostWakeRefusal;
use App\Agents\Drivers\Enums\RequestOutcome;
use App\Agents\Drivers\Enums\RequestProgress;
use App\Agents\Drivers\Values\RequestReportBinding;
use App\Agents\Enums\ConversationModeType;
use App\Exceptions\HostReportRefused;
use App\Hosts\EnrolledHost;
use App\Models\Accounts\Account;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Drivers\DriverRequest;
use App\Models\Drivers\RuntimeEvent;
use App\Models\Projects\Host;
use App\Models\Sessions\SessionRequest;
use App\Sessions\AgentWakes;
use App\Sessions\Contracts\AgentDirectory;
use App\Sessions\Enums\SessionStatus;
use App\Sessions\Enums\StartOriginType;
use App\Sessions\Enums\StartReadiness;
use App\Sessions\Enums\StartRefusalReason;
use App\Sessions\InitialWakeSettlement;
use App\Sessions\OpenedRuntime;
use App\Sessions\Values\StartPolicy;
use App\Support\ActorReference;
use App\Support\AgentStatus;
use App\Terminals\Commands\CancelKeyScript\CancelKeyScriptCommand;
use App\Terminals\Commands\ResumeKeyScript\ResumeKeyScriptCommand;
use App\Values\AgentText;
use App\Values\ClaimedRequest;
use App\Values\DriverReceipt;
use App\Values\ScriptProgress;
use App\Values\StackTarget;
use App\Values\StartRequest;
use PhpOption\None;
use Tests\Fixtures\Agents\TestSelections;
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
        [$host, $opened] = $this->openHostClaimedRuntime(firstMessage: 'Behind a menu');
        $this->journal->claimRequestsOnHost($host->hostId, 10);

        $this->notifyProgress($host->hostId, $opened->firstRequestId, RequestProgress::Staged);

        $this->assertSame(
            RequestProgress::Accepted,
            DriverRequest::query()->findOrFail($opened->firstRequestId)->progress,
        );
        $tooSoon = $this->journal->claimRequestsOnHost($host->hostId, 10);
        $this->assertSame([], $tooSoon->requests);

        $this->travel(3)->seconds();
        $again = $this->journal->claimRequestsOnHost($host->hostId, 10);

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
        [$host, $signedOut] = $this->openHostClaimedRuntime(firstMessage: 'Signed out');
        $this->journal->claimRequestsOnHost($host->hostId, 10);
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

        [$stopHost, $stopped] = $this->openRuntime(driverType: DriverType::Headless);
        $stop = $this->asOwner(new StopAgentCommand($this->agentIdOf($stopped), $stopped->sessionId, 'stop-1'));
        $this->journal->claimRequestsOnHost($stopHost->hostId, 10);
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
        [$host, $opened] = $this->openHostClaimedRuntime();
        $agentId = $this->agentIdOf($opened);
        $runtime = AgentRuntime::query()->findOrFail($opened->runtimeId);
        $stop = $this->asOwner(
            new StopAgentCommand($agentId, $opened->sessionId, 'stop-1', $runtime->process_generation),
        );
        $this->journal->claimRequestsOnHost($host->hostId, 10);
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
        [$host, $opened] = $this->openHostClaimedRuntime();
        $resumed = DriverRequest::query()->findOrFail(
            $this->asOwner($this->keyScript($opened, 'ChangeModel', ['model' => 'gpt-6']))->requestId,
        );
        $cancelled = DriverRequest::query()->findOrFail(
            $this->asOwner($this->keyScript($opened, 'ChangeModel', ['model' => 'opus']))->requestId,
        );

        foreach ([
            $resumed,
            $cancelled,
        ] as $request) {
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
            [[
                $wake->id,
                true,
                $pendingWork,
            ]],
            array_map(
                fn (ClaimedRequest $request) => [
                    $request->requestId,
                    $request->shouldBootstrap,
                    $request->message,
                ],
                $bootstrap,
            ),
        );
        $this->assertSame(
            [[
                $opened->firstRequestId,
                false,
            ]],
            array_map(fn (ClaimedRequest $request) => [
                $request->requestId,
                $request->shouldBootstrap,
            ], $after),
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
            [StartReadiness::Refused, StartRefusalReason::IdentityMismatch->value],
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
        $record->refuseFor(StartRefusalReason::IdentityMismatch);

        $this->notifyApplied($host, $wake, self::CONVERSATION);

        $this->assertSame([StartReadiness::Refused, null], [$record->refresh()->readiness, $record->native_id]);
        $this->assertSame([], $this->claimedIds($host));
    }

    public function test_a_numbered_report_sent_again_is_taken_once(): void
    {
        [$host, $opened] = $this->openHostClaimedRuntime();
        $receipt = $this->deliver($opened, 'replayed', 'Read the notes');
        $this->journal->claimRequestsOnHost($host->hostId, 10);

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
        [$host, $opened] = $this->openHostClaimedRuntime(firstMessage: 'Start with the plan.');
        $session = AgentSession::query()->findOrFail($opened->sessionId);
        $request = new StartRequest(
            TestSelections::requestId(),
            $session->agent_id,
            TestSelections::of(DefaultDrivers::CODEX),
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

        return [
            $host,
            $opened,
            DriverRequest::query()->findOrFail($receipt->requestId),
            $record,
        ];
    }

    /**
     * @return list<ClaimedRequest>
     */
    private function claimed(EnrolledHost $host): array
    {
        return $this->journal->claimRequestsOnHost($host->hostId, 10)->requests;
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
