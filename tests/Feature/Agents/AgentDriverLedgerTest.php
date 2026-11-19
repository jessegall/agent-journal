<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Exceptions\ActorNotAllowed;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Agents\Commands\CancelDriverRequest;
use App\Agents\Commands\CancelKeyScript;
use App\Agents\Commands\ChangeAgentEffort;
use App\Agents\Commands\ChangeAgentModel;
use App\Agents\Commands\ClaimDriverRequests;
use App\Agents\Commands\ClaimLaunchGrant;
use App\Agents\Commands\DeliverAgent;
use App\Agents\Commands\EnrollHost;
use App\Agents\Commands\InterruptAgent;
use App\Agents\Commands\OpenAgentRuntime;
use App\Agents\Commands\RecordRuntime;
use App\Agents\Commands\ReleaseAgentHold;
use App\Agents\Commands\RepairDriverSettings;
use App\Agents\Commands\ReportDriverTurn;
use App\Agents\Commands\ReportRequestProgress;
use App\Agents\Commands\ReportRuntimeActivity;
use App\Agents\Commands\ReportRuntimeExit;
use App\Agents\Commands\ReportRuntimeHeartbeat;
use App\Agents\Commands\ResolveDriverDelivery;
use App\Agents\Commands\ResumeKeyScript;
use App\Agents\Commands\RetireAgent;
use App\Agents\Commands\RetryDriverRequest;
use App\Agents\Commands\RunKeyScript;
use App\Agents\Commands\StopAgent;
use App\Agents\Commands\WakeAgent;
use App\Agents\Contracts\RuntimeResolver;
use App\Agents\Enums\DriverOperation;
use App\Agents\Enums\DriverType;
use App\Agents\Enums\HoldReason;
use App\Agents\Enums\RecoveryAction;
use App\Agents\Enums\RequestOutcome;
use App\Agents\Enums\RequestProgress;
use App\Agents\Enums\RuntimeActivity;
use App\Agents\Enums\SessionStatus;
use App\Agents\Events\DriverRequestRecovered;
use App\Agents\Exceptions\DriverRequestRefused;
use App\Agents\Exceptions\HostReportRefused;
use App\Agents\Exceptions\KeyScriptRefused;
use App\Agents\Exceptions\StaleProcessGeneration;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\AgentSession;
use App\Agents\Models\DriverRequest;
use App\Agents\Models\DriverTurn;
use App\Agents\Support\ClaimedRequests;
use App\Agents\Support\DriverBudgets;
use App\Agents\Support\DriverReceipt;
use App\Agents\Support\EnrolledHost;
use App\Agents\Support\LaunchGrant;
use App\Agents\Support\NativeTurns;
use App\Agents\Support\OpenedRuntime;
use App\Agents\Support\PendingWorkSources;
use App\Agents\Values\ScriptParameter;
use App\Agents\Values\ScriptProgress;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandBus;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use Spatie\LaravelData\Optional;
use Tests\Fixtures\Agents\CountedPendingWork;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsHostCalls;
use Tests\Support\TestLaunchAuthority;
use Tests\TestCase;

/**
 * The driver ledger end to end inside the journal (plan 26 phase 2): opening a runtime, the six acceptance commands
 * with their ordering and idempotency, the host protocol and its stale-report fences, the runtime reader and the
 * heartbeat bridge. Hosts are driven through their commands; one test goes through the signed host route.
 */
final class AgentDriverLedgerTest extends TestCase
{
    use CommitsHookRows;
    use RunsTrustedCommands;
    use SendsHostCalls;

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'launch_credentials',
        'agent_stacks',
        'hook_calls',
        'hosts',
        'agent_runtimes',
        'driver_requests',
        'driver_turns',
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
            new OpenAgentRuntime(
                $this->agent()->id,
                $host->hostId,
                '/elsewhere',
                'claude-code',
                '2.1.323',
                'claude',
                DriverType::Process,
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
            new ChangeAgentEffort($this->agentIdOf($opened), $opened->sessionId, 'effort-1', 'high'),
        );
        $this->asOwner(new ChangeAgentEffort($this->agentIdOf($opened), $opened->sessionId, 'effort-2', 'low'));

        $this->assertSame(RequestProgress::Superseded, DriverRequest::query()->findOrFail($high->requestId)->progress);
    }

    public function test_an_unknown_effort_is_refused_before_anything_is_accepted(): void
    {
        [, $opened] = $this->openRuntime();

        try {
            $this->asOwner(new ChangeAgentEffort($this->agentIdOf($opened), $opened->sessionId, 'effort-1', 'extreme'));
            $this->fail('An unknown effort was accepted.');
        } catch (DriverRequestRefused) {
            $this->assertSame(0, DriverRequest::query()->where('operation', DriverOperation::ChangeEffort)->count());
        }
    }

    public function test_repeated_wakes_raise_one_open_wake(): void
    {
        [, $opened] = $this->openRuntime();

        $first = $this->asOwner(new WakeAgent($this->agentIdOf($opened), $opened->sessionId, 'wake-1'));
        $second = $this->asOwner(new WakeAgent($this->agentIdOf($opened), $opened->sessionId, 'wake-2'));

        $this->assertSame($first->requestId, $second->requestId);
        $this->assertSame(1, DriverRequest::query()->where('operation', DriverOperation::Wake)->count());
        $this->assertSame(2, DriverRequest::query()->findOrFail($first->requestId)->wake_requested);
    }

    public function test_session_activity_acknowledges_only_the_claimed_wake_and_a_later_one_stays_pending(): void
    {
        [$host, $opened] = $this->openRuntime();
        $this->asSystem(
            new ReportRuntimeActivity($host->hostId, $opened->runtimeId, RuntimeActivity::Running, HoldReason::None, 1),
        );
        $this->asOwner(new WakeAgent($this->agentIdOf($opened), $opened->sessionId, 'wake-1'));
        $this->asSystem(new ClaimDriverRequests($host->hostId, 10));
        $this->asOwner(new WakeAgent($this->agentIdOf($opened), $opened->sessionId, 'wake-2'));
        $turns = $this->app->make(NativeTurns::class);

        $turns->acknowledgeWake($opened->sessionId, CarbonImmutable::now()->addSecond());

        $wake = DriverRequest::query()->where('operation', DriverOperation::Wake)->sole();
        $this->assertSame(
            [1, 2, RequestProgress::Accepted],
            [$wake->wake_acknowledged, $wake->wake_requested, $wake->progress],
        );

        $this->asSystem(new ClaimDriverRequests($host->hostId, 10));
        $turns->acknowledgeWake($opened->sessionId, CarbonImmutable::now()->addSecond());

        $wake->refresh();
        $this->assertSame([2, RequestProgress::Applied], [$wake->wake_acknowledged, $wake->progress]);
        $this->assertNull($wake->outcome);
    }

    public function test_activity_from_before_the_wake_was_taken_acknowledges_nothing(): void
    {
        [$host, $opened] = $this->openRuntime();
        $this->asSystem(
            new ReportRuntimeActivity($host->hostId, $opened->runtimeId, RuntimeActivity::Running, HoldReason::None, 1),
        );
        $this->asOwner(new WakeAgent($this->agentIdOf($opened), $opened->sessionId, 'wake-1'));
        $this->asSystem(new ClaimDriverRequests($host->hostId, 10));

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
            new ReportRuntimeActivity($host->hostId, $opened->runtimeId, RuntimeActivity::Idle, HoldReason::None, 1),
        );
        $this->asOwner(new WakeAgent($this->agentIdOf($opened), $opened->sessionId, 'wake-1'));

        $claimed = $this->asSystem(new ClaimDriverRequests($host->hostId, 10));

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
            new ReportRuntimeActivity($host->hostId, $opened->runtimeId, RuntimeActivity::Idle, HoldReason::None, 1),
        );
        $this->asOwner(new WakeAgent($this->agentIdOf($opened), $opened->sessionId, 'wake-1'));

        $claimed = $this->asSystem(new ClaimDriverRequests($host->hostId, 10));

        $this->assertCount(1, $claimed->requests);
        $this->assertSame(
            RequestProgress::Staged,
            DriverRequest::query()->where('operation', DriverOperation::Wake)->sole()->progress,
        );
    }

    public function test_an_interrupt_holds_the_runtime_at_once(): void
    {
        [, $opened] = $this->openRuntime();

        $this->asOwner(new InterruptAgent($this->agentIdOf($opened), $opened->sessionId, 'interrupt-1'));

        $this->assertSame(HoldReason::Interrupted, AgentRuntime::query()->findOrFail($opened->runtimeId)->hold_reason);
    }

    public function test_a_stopping_runtime_refuses_new_requests(): void
    {
        [, $opened] = $this->openRuntime();
        $this->asOwner(new StopAgent($this->agentIdOf($opened), $opened->sessionId, 'stop-1'));

        $this->expectException(DriverRequestRefused::class);

        $this->deliver($opened, 'after-stop', 'Too late');
    }

    public function test_a_host_claims_only_the_requests_of_its_own_runtimes(): void
    {
        [$host, $opened] = $this->openRuntime(firstMessage: 'Mine');
        [, $foreign] = $this->openRuntime(firstMessage: 'Not mine');

        $claimed = $this->asSystem(new ClaimDriverRequests($host->hostId, 10));

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

    public function test_the_launch_grant_is_handed_out_once(): void
    {
        [$host, $opened] = $this->openRuntime();

        $first = $this->asSystem(new ClaimLaunchGrant($host->hostId, $opened->runtimeId));
        $second = $this->asSystem(new ClaimLaunchGrant($host->hostId, $opened->runtimeId));

        $this->assertInstanceOf(LaunchGrant::class, $first);
        $this->assertNotSame('', $first->token);
        $this->assertNull($second);
    }

    public function test_another_host_cannot_take_a_runtimes_launch_grant(): void
    {
        [, $opened] = $this->openRuntime();
        $other = $this->enrollHost();

        $this->expectException(HostReportRefused::class);

        $this->asSystem(new ClaimLaunchGrant($other->hostId, $opened->runtimeId));
    }

    public function test_a_report_of_an_older_generation_is_refused_and_leaves_newer_facts(): void
    {
        [$host, $opened] = $this->openRuntime();
        $this->asSystem(
            new ReportRuntimeActivity($host->hostId, $opened->runtimeId, RuntimeActivity::Running, HoldReason::None, 2),
        );

        try {
            $this->asSystem(
                new ReportRuntimeActivity(
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
            new ReportDriverTurn($host->hostId, $opened->runtimeId, 1, 'prompt-1', false, 'opus', 'high', null),
        );
        $this->assertSame(RuntimeActivity::Running, AgentRuntime::query()->findOrFail($opened->runtimeId)->activity);

        $this->asSystem(
            new ReportDriverTurn($host->hostId, $opened->runtimeId, 1, 'prompt-1', true, 'opus', 'high', 'finished'),
        );

        $runtime = AgentRuntime::query()->findOrFail($opened->runtimeId);
        $this->assertSame(RuntimeActivity::Idle, $runtime->activity);
        $this->assertSame('high', $runtime->observed_effort);
        $this->assertSame(1, DriverTurn::query()->where('agent_runtime_id', $opened->runtimeId)->count());
    }

    public function test_the_reader_keeps_a_staged_effort_apart_from_the_observed_one(): void
    {
        [, $opened] = $this->openRuntime();
        AgentRuntime::query()->findOrFail($opened->runtimeId)->requestEffort('low');

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
            new ReportRuntimeHeartbeat($host->hostId, $opened->runtimeId, $generation, 'owned process alive'),
        );

        $this->assertNotNull(AgentSession::query()->findOrFail($opened->sessionId)->last_heartbeat_at);
    }

    public function test_a_heartbeat_of_another_generation_is_refused(): void
    {
        [$host, $opened] = $this->openRuntime();

        $this->expectException(HostReportRefused::class);

        $this->asSystem(new ReportRuntimeHeartbeat($host->hostId, $opened->runtimeId, 99, 'owned process alive'));
    }

    public function test_a_verified_exit_ends_the_session(): void
    {
        [$host, $opened] = $this->openRuntime();
        $generation = AgentRuntime::query()->findOrFail($opened->runtimeId)->process_generation;

        $this->asSystem(new ReportRuntimeExit($host->hostId, $opened->runtimeId, $generation, 'exit code 0'));

        $this->assertSame(SessionStatus::Ended, AgentSession::query()->findOrFail($opened->sessionId)->status);
    }

    public function test_a_confirmed_stop_ends_the_session_revokes_it_and_leaves_no_request_open(): void
    {
        [$host, $opened] = $this->openRuntime();
        $this->deliver($opened, 'before-stop', 'Never delivered');
        $this->asOwner(new StopAgent($this->agentIdOf($opened), $opened->sessionId, 'stop-1'));

        $this->reportExit($host, $opened);

        $session = AgentSession::query()->with('credential')->findOrFail($opened->sessionId);
        $requests = DriverRequest::query()->where('agent_runtime_id', $opened->runtimeId)->get();
        $this->assertSame(SessionStatus::Ended, $session->status);
        $this->assertTrue($session->credential?->isRevoked());
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

        $this->asOwner(new WakeAgent($this->agentIdOf($opened), $opened->sessionId, 'wake-after-exit'));
    }

    public function test_retiring_an_agent_with_a_running_runtime_stops_it_through_its_host(): void
    {
        [$host, $opened] = $this->openRuntime();

        $this->asOwner(new RetireAgent($this->agentIdOf($opened)));

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
        $this->asSystem(new ClaimDriverRequests($host->hostId, 10));
        $this->reportProgress($host->hostId, $unavailable->requestId, RequestProgress::Unavailable);
        $this->reportProgress($host->hostId, $failed->requestId, RequestProgress::Failed);

        $request = DriverRequest::query()->findOrFail($unavailable->requestId);

        $this->assertSame(RequestProgress::Unavailable, $request->progress);
        $this->assertSame(RequestOutcome::EntryUnavailable, $request->outcome);
        $this->assertSame(RequestProgress::Failed, DriverRequest::query()->findOrFail($failed->requestId)->progress);

        $this->asOwner(new RetryDriverRequest($request->id, $request->row_version, 'the runtime is back'));

        $this->assertSame(RequestProgress::Accepted, $request->fresh()?->progress);
    }

    public function test_retrying_a_failed_request_starts_a_new_attempt_and_refuses_reports_of_the_old_one(): void
    {
        [$host, $opened] = $this->openRuntime();
        $receipt = $this->deliver($opened, 'fails-once', 'Hello');
        $this->asSystem(new ClaimDriverRequests($host->hostId, 10));
        $request = DriverRequest::query()->findOrFail($receipt->requestId);
        $oldAttempt = $request->attempt_version;
        $this->asSystem(new ReportRequestProgress(
            $host->hostId, $request->id, $oldAttempt, RequestProgress::Failed, null, RequestOutcome::EntryUnavailable,
        ));
        $request->refresh();

        $this->asOwner(new RetryDriverRequest($request->id, $request->row_version, 'the entry is back'));

        $request->refresh();
        $this->assertSame(
            [RequestProgress::Accepted, $oldAttempt + 1],
            [$request->progress, $request->attempt_version],
        );
        $this->expectException(HostReportRefused::class);
        $this->asSystem(new ReportRequestProgress(
            $host->hostId, $request->id, $oldAttempt, RequestProgress::Applied, 'late', null,
        ));
    }

    public function test_an_uncertain_delivery_is_resolved_not_retried(): void
    {
        [$host, $opened] = $this->openRuntime();
        $receipt = $this->deliver($opened, 'uncertain', 'Hello');
        $this->asSystem(new ClaimDriverRequests($host->hostId, 10));
        $request = DriverRequest::query()->findOrFail($receipt->requestId);
        $this->asSystem(new ReportRequestProgress(
            $host->hostId, $request->id, $request->attempt_version, RequestProgress::DeliveryUncertain, null, null,
        ));
        $request->refresh();

        $this->assertThrows(
            fn () => $this->asOwner(new RetryDriverRequest($request->id, $request->row_version, 'again')),
            DriverRequestRefused::class,
        );
        $this->asOwner(new ResolveDriverDelivery($request->id, $request->row_version, false, 'never arrived'));

        $this->assertSame(RequestProgress::Unavailable, $request->fresh()?->progress);
    }

    public function test_a_wake_has_no_delivery_to_resolve(): void
    {
        [, $opened] = $this->openRuntime();
        $wake = $this->asOwner(new WakeAgent($this->agentIdOf($opened), $opened->sessionId, 'wake-1'));
        $request = DriverRequest::query()->findOrFail($wake->requestId);

        $this->expectException(DriverRequestRefused::class);

        $this->asOwner(new ResolveDriverDelivery($request->id, $request->row_version, true, 'it woke'));
    }

    public function test_cancelling_a_setting_puts_the_requested_settings_back_and_is_recorded(): void
    {
        Event::fake([DriverRequestRecovered::class]);
        [, $opened] = $this->openRuntime();
        $agentId = $this->agentIdOf($opened);
        $this->asOwner(new ChangeAgentModel($agentId, $opened->sessionId, 'model-1', 'claude-sonnet-5-5'));
        $effort = $this->asOwner(new ChangeAgentEffort($agentId, $opened->sessionId, 'effort-1', 'high'));
        $request = DriverRequest::query()->findOrFail($effort->requestId);

        $this->asOwner(new CancelDriverRequest($request->id, $request->row_version, 'not needed after all'));

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

        $this->asOwner(new CancelDriverRequest($request->id, $request->row_version + 1, 'too late'));
    }

    public function test_a_failed_effort_change_is_repaired_in_its_own_place_in_the_queue(): void
    {
        [$host, $opened] = $this->openRuntime();
        $agentId = $this->agentIdOf($opened);
        $effort = $this->asOwner(new ChangeAgentEffort($agentId, $opened->sessionId, 'effort-1', 'high'));
        $this->asSystem(new ClaimDriverRequests($host->hostId, 10));
        $request = DriverRequest::query()->findOrFail($effort->requestId);
        $attempt = $request->attempt_version;
        $this->asSystem(new ReportRequestProgress(
            $host->hostId, $request->id, $attempt, RequestProgress::Failed, null, RequestOutcome::Refused,
        ));
        $request->refresh();
        $sequence = $request->sequence;

        $this->asOwner(new RepairDriverSettings($request->id, $request->row_version, 'low', 'high is not offered'));

        $request->refresh();
        $this->assertSame([RequestProgress::Accepted, 'low'], [$request->progress, $request->effort]);
        $this->assertSame([$sequence, $attempt + 1], [$request->sequence, $request->attempt_version]);
        $this->assertSame('low', AgentRuntime::query()->findOrFail($opened->runtimeId)->requested_effort);
    }

    public function test_a_person_releases_an_interrupt_but_never_a_hold_the_program_shows(): void
    {
        [$host, $opened] = $this->openRuntime();
        $agentId = $this->agentIdOf($opened);
        $this->asOwner(new InterruptAgent($agentId, $opened->sessionId, 'interrupt-1'));
        $this->asOwner(new WakeAgent($agentId, $opened->sessionId, 'wake-after-interrupt'));
        $runtime = fn () => AgentRuntime::query()->findOrFail($opened->runtimeId);
        $this->assertSame(HoldReason::Interrupted, $runtime()->hold_reason);

        $this->asOwner(new ReleaseAgentHold($agentId, $opened->sessionId, HoldReason::Interrupted, 'go on'));
        $this->assertSame(HoldReason::None, $runtime()->hold_reason);

        $this->asSystem(new ReportRuntimeActivity(
            $host->hostId, $opened->runtimeId, RuntimeActivity::Running, HoldReason::Compacting, 1,
        ));
        $this->expectException(DriverRequestRefused::class);
        $this->asOwner(new ReleaseAgentHold($agentId, $opened->sessionId, HoldReason::Compacting, 'hurry'));
    }

    public function test_a_stopped_key_script_resumes_from_its_step_or_is_cancelled(): void
    {
        [$host, $opened] = $this->openRuntime();
        $resumed = DriverRequest::query()->findOrFail(
            $this->asOwner($this->keyScript($opened, 'LoginMcp', ['server' => 'journal']))->requestId,
        );
        $cancelled = DriverRequest::query()->findOrFail(
            $this->asOwner($this->keyScript($opened, 'LoginMcp', ['server' => 'other']))->requestId,
        );
        foreach ([$resumed, $cancelled] as $request) {
            $this->asSystem(new ReportRequestProgress(
                $host->hostId, $request->id, $request->attempt_version, RequestProgress::Applying, null, null,
                new ScriptProgress(2, 7, 'paused: a person typed'),
            ));
            $request->refresh();
        }
        $attempt = $resumed->attempt_version;

        $this->asOwner(new ResumeKeyScript($resumed->id, $resumed->row_version, 'done typing'));
        $this->asOwner(new CancelKeyScript($cancelled->id, $cancelled->row_version, 'not needed'));

        $resumed->refresh();
        $this->assertSame(RequestProgress::Accepted, $resumed->progress);
        $this->assertSame([$attempt + 1, 2], [$resumed->attempt_version, $resumed->script_step]);
        $this->assertSame(RequestProgress::Cancelled, $cancelled->fresh()?->progress);
    }

    public function test_the_owner_asks_the_host_to_start_and_stop_a_recording(): void
    {
        [, $opened] = $this->openRuntime();
        $agentId = $this->agentIdOf($opened);

        $start = $this->asOwner(new RecordRuntime($agentId, $opened->sessionId, 'record-1', false));
        $stop = $this->asOwner(new RecordRuntime($agentId, $opened->sessionId, 'record-2', true));

        $operations = DriverRequest::query()->whereKey([$start->requestId, $stop->requestId])->orderBy('sequence')
            ->pluck('operation')->all();
        $this->assertSame([DriverOperation::StartRecording, DriverOperation::StopRecording], $operations);
    }

    public function test_a_stop_and_an_interrupt_are_claimed_past_a_full_batch_of_normal_work(): void
    {
        [$host, $opened] = $this->openRuntime();
        foreach (range(1, 12) as $number) {
            $this->deliver($opened, "work-{$number}", "Work {$number}");
        }
        $this->asOwner(new InterruptAgent($this->agentIdOf($opened), $opened->sessionId, 'interrupt-1'));
        $this->asOwner(new StopAgent($this->agentIdOf($opened), $opened->sessionId, 'stop-1'));

        $claimed = $this->asSystem(new ClaimDriverRequests($host->hostId, 5));

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
            new ReportRuntimeActivity($host->hostId, $opened->runtimeId, RuntimeActivity::Running, HoldReason::None, 3),
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
    }

    public function test_an_operator_appends_one_registered_key_script_request(): void
    {
        [, $opened] = $this->openRuntime();

        $receipt = $this->asOwner($this->keyScript($opened, 'LoginMcp', ['server' => 'journal']));

        $request = DriverRequest::query()->findOrFail($receipt->requestId);
        $this->assertSame(DriverOperation::KeyScript, $request->operation);
        $this->assertSame('LoginMcp', $request->script_id);
        $this->assertSame(['server' => 'journal'], $request->script_parameters);
    }

    public function test_an_unregistered_script_or_an_extra_parameter_is_refused_before_acceptance(): void
    {
        [, $opened] = $this->openRuntime();
        $before = DriverRequest::query()->count();

        $refused = [['Format', ['server' => 'journal']], ['LoginMcp', ['server' => 'journal', 'shell' => 'rm']]];

        foreach ($refused as [$name, $parameters]) {
            try {
                $this->asOwner($this->keyScript($opened, $name, $parameters));
                $this->fail("{$name} with these parameters was accepted.");
            } catch (KeyScriptRefused) {
                $this->assertSame($before, DriverRequest::query()->count());
            }
        }
    }

    public function test_an_agent_cannot_run_a_key_script(): void
    {
        [, $opened] = $this->openRuntime();
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forAgent($this->agentIdOf($opened)),
            TestLaunchAuthority::forAgent($this->agentIdOf($opened)),
        );

        $this->expectException(ActorNotAllowed::class);
        $this->app->make(CommandBus::class)->run($this->keyScript($opened, 'LoginMcp', ['server' => 'journal']));
    }

    public function test_a_progress_report_records_the_scripts_step_and_evidence(): void
    {
        [$host, $opened] = $this->openRuntime();
        $receipt = $this->asOwner($this->keyScript($opened, 'LoginMcp', ['server' => 'journal']));
        $request = DriverRequest::query()->findOrFail($receipt->requestId);
        $progress = new ScriptProgress(2, 7, 'menu login-method, stable');

        $attempt = $request->attempt_version;
        $this->asSystem(
            new ReportRequestProgress(
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
        $this->assertSame('menu login-method, stable', $request->script_evidence);
    }

    /**
     * @return array{EnrolledHost, OpenedRuntime}
     */
    private function openRuntime(string|null $firstMessage = null): array
    {
        $host = $this->enrollHost();
        $opened = $this->asOwner(
            new OpenAgentRuntime(
                $this->agent()->id,
                $host->hostId,
                self::FOLDER,
                'claude-code',
                '2.1.323',
                'claude',
                DriverType::Process,
                'claude-opus-5-5',
                firstMessage: $firstMessage,
            ),
        );

        return [$host, $opened];
    }

    private function reportExit(EnrolledHost $host, OpenedRuntime $opened): void
    {
        $generation = AgentRuntime::query()->findOrFail($opened->runtimeId)->process_generation;

        $this->asSystem(new ReportRuntimeExit($host->hostId, $opened->runtimeId, $generation, 'exit code 0'));
    }

    private function enrollHost(): EnrolledHost
    {
        return $this->asSystem(new EnrollHost('test host '.Str::random(6), [self::FOLDER]));
    }

    private function agent(): Agent
    {
        return Agent::named('Driven agent '.Str::random(6), 'main-agent');
    }

    private function agentIdOf(OpenedRuntime $opened): string
    {
        return AgentSession::query()->findOrFail($opened->sessionId)->agent_id;
    }

    /**
     * @param  array<string, string>  $parameters
     */
    private function keyScript(OpenedRuntime $opened, string $script, array $parameters): RunKeyScript
    {
        $key = (string) Str::ulid();
        $named = array_map(
            fn (string $name, string $value) => new ScriptParameter($name, $value),
            array_keys($parameters),
            $parameters,
        );

        return new RunKeyScript($this->agentIdOf($opened), $opened->sessionId, $key, $script, array_values($named));
    }

    private function deliver(OpenedRuntime $opened, string $key, string $message): DriverReceipt
    {
        return $this->asOwner(new DeliverAgent($this->agentIdOf($opened), $opened->sessionId, $key, $message));
    }

    /**
     * Runs a command as the person who owns the journal, as the web and the CLI do.
     *
     * @template TResult
     *
     * @param  Command<TResult>  $command
     * @return TResult
     */
    private function reportProgress(string $hostId, string $requestId, RequestProgress $progress): void
    {
        $request = DriverRequest::query()->findOrFail($requestId);

        $this->asSystem(new ReportRequestProgress(
            $hostId, $request->id, $request->attempt_version, $progress, null, RequestOutcome::EntryUnavailable,
        ));
    }

    private function asOwner(Command $command): mixed
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser('owner'), new OwnerAuthority('test'));

        return $this->app->make(CommandBus::class)->run($command);
    }
}
