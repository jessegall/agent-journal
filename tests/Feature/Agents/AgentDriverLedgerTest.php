<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Commands\Agents\DeliverAgent\DeliverAgentCommand;
use App\Commands\Agents\NotifyRuntimeExit\NotifyRuntimeExitCommand;
use App\Commands\Agents\OpenAgentRuntime\OpenAgentRuntimeCommand;
use App\Commands\Drivers\ClaimDriverRequests\ClaimDriverRequestsCommand;
use App\Commands\Drivers\NotifyRequestProgress\NotifyRequestProgressCommand;
use App\Commands\Drivers\NotifyRuntimeActivity\NotifyRuntimeActivityCommand;
use App\Commands\Drivers\RetryDriverRequest\RetryDriverRequestCommand;
use App\Commands\Sessions\ClaimStartGrant\ClaimStartGrantCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Drivers\AttachmentReferences;
use App\Contracts\Sessions\AgentDirectory;
use App\Contracts\Sessions\RuntimeResolver;
use App\Data\Messages\MessageAttachmentData;
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
use App\Exceptions\StaleProcessGeneration;
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
use App\Support\ActorContext;
use App\Support\AgentStatus;
use App\Support\ArrangementSetting;
use App\Support\DefaultDrivers;
use App\Support\EnrolledHost;
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
use App\Values\StartPolicy;
use App\Values\StopConditions;
use Carbon\CarbonImmutable;
use Spatie\LaravelData\Optional;
use Tests\Support\Agents\HostContract;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestStartAuthority;
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

    public function test_the_host_reports_a_navigation_hold_and_ends_requests_unavailable_or_unconfirmed(): void
    {
        [$host, $opened] = $this->openRuntime();
        $runtime = AgentRuntime::query()->findOrFail($opened->runtimeId);
        $unavailable = $this->deliver($opened, 'entry-gone', 'Pick GPT-6');
        $unconfirmed = $this->deliver($opened, 'only-highlighted', 'Pick GPT-6 again');
        $this->journal->asSystem(new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()));

        $this->journal->hostCall($host, 'POST', '/host/reports/activity', [
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
            $this->journal->hostCall($host, 'POST', '/host/reports/request', [
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
        $reports = [
            [$refused, 'container-unavailable'],
            [$unnamed, 'disk-on-fire'],
            [$missing, 'pinned-build-missing'],
        ];

        foreach ($reports as [$receipt, $reason]) {
            $this->journal->hostCall($host, 'POST', '/host/reports/request', [
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

    public function test_a_hook_call_of_an_older_generation_is_refused(): void
    {
        [$host, $opened] = $this->openRuntime();
        $this->journal->asSystem(
            new NotifyRuntimeActivityCommand(
                $host->hostId,
                $opened->runtimeId,
                RuntimeActivity::Running,
                HoldReason::None,
                3,
            ),
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
        $response = $this->journal->hostCall($host, 'POST', '/host/claim?limit=5&wait=0&watched_version=0');

        $response->assertOk();
        $this->assertSame($opened->firstRequestId, $response->json('requests.0.requestId'));
        $this->assertSame([], $response->json('requests.0.scriptParameters'));
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

    /**
     * The request as the host's claim hands it out.
     *
     * @return array<string, mixed>
     */
    private function claimedScript(EnrolledHost $host, string $requestId): array
    {
        $requests = $this->journal->hostCall(
            $host,
            'POST',
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
        $this->journal->hostCall($host, 'POST', '/host/reports/request', [
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

        $this->journal->asSystem(
            new NotifyRuntimeExitCommand($host->hostId, $opened->runtimeId, $generation, 'exit code 0'),
        );
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

    public function test_an_idle_report_after_a_missing_one_leaves_the_running_request_uncertain(): void
    {
        [$host, $opened] = $this->openRuntime();
        $runtime = AgentRuntime::query()->findOrFail($opened->runtimeId);
        $receipt = $this->deliver($opened, 'gap', 'Read the notes');
        $this->journal->asSystem(new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()));
        $this->numberedReport($host->hostId, $receipt->requestId, RequestProgress::Applying, 1);

        $this->journal->asSystem(new NotifyRuntimeActivityCommand(
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
        $this->journal->asSystem(new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()));
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
        $this->journal->asSystem(new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()));
        $request = DriverRequest::query()->findOrFail($receipt->requestId);
        $this->journal->asSystem(new NotifyRequestProgressCommand(
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

        $this->journal->hostCall(
            $host,
            'POST',
            '/host/reports/request',
            $turnEnd === null ? [...$report, 'progress' => 'staged'] : [...$report, 'turn_end' => $turnEnd],
        )->assertSuccessful();
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
}
