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
use App\Commands\OpenAgentRuntime\OpenAgentRuntimeCommand;
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
use App\Contracts\AgentDirectory;
use App\Contracts\CommandBus;
use App\Contracts\CurrentActorSetter;
use App\Contracts\DriverCatalogue;
use App\Contracts\RuntimeResolver;
use App\Enums\DriverOperation;
use App\Enums\DriverVariant;
use App\Enums\ExecutionModeType;
use App\Enums\HoldReason;
use App\Enums\HostWakeRefusal;
use App\Enums\RecoveryAction;
use App\Enums\RequestOutcome;
use App\Enums\RequestProgress;
use App\Enums\RuntimeActivity;
use App\Enums\SessionStatus;
use App\Events\DriverRequestRecovered;
use App\Exceptions\AccountFolderInvalid;
use App\Exceptions\ActorNotAllowed;
use App\Exceptions\DriverRequestRefused;
use App\Exceptions\HostReportRefused;
use App\Exceptions\KeyScriptRefused;
use App\Exceptions\StaleProcessGeneration;
use App\Exceptions\StopOutdated;
use App\Models\Account;
use App\Models\ActiveAccount;
use App\Models\AgentRuntime;
use App\Models\AgentSession;
use App\Models\DriverRequest;
use App\Models\DriverTurn;
use App\Models\ProcessStart;
use App\Models\RuntimeEvent;
use App\Models\SessionPolicy;
use App\Support\ActorContext;
use App\Support\AgentStatus;
use App\Support\ArrangementSetting;
use App\Support\ClaimedRequests;
use App\Support\DefaultDrivers;
use App\Support\DriverBudgets;
use App\Support\EnrolledHost;
use App\Support\InitialWakeSettlement;
use App\Support\NativeTurns;
use App\Support\OpenedRuntime;
use App\Support\PendingWorkSources;
use App\Support\StartGrant;
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
use Illuminate\Support\Facades\Event;
use Spatie\LaravelData\Optional;
use Tests\Fixtures\Agents\CountedPendingWork;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsHostCalls;
use Tests\Support\TestStartAuthority;
use Tests\TestCase;

/**
 * The driver ledger end to end inside the journal (plan 26 phase 2): opening a runtime, the six acceptance commands
 * with their ordering and idempotency, the host protocol and its stale-report fences, the runtime reader and the
 * heartbeat bridge. Hosts are driven through their commands; one test goes through the signed host route.
 */
final class AgentDriverLedgerTest extends TestCase
{
    use CommitsHookRows;
    use OpensLedgerRuntimes;
    use RunsTrustedCommands;
    use SendsHostCalls;

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
                DriverVariant::Headless,
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
            new ChangeAgentEffortCommand($this->agentIdOf($opened), $opened->sessionId, 'effort-1', 'high'),
        );
        $this->asOwner(new ChangeAgentEffortCommand($this->agentIdOf($opened), $opened->sessionId, 'effort-2', 'low'));

        $this->assertSame(RequestProgress::Superseded, DriverRequest::query()->findOrFail($high->requestId)->progress);
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

        $key = $this->app->make(DriverCatalogue::class)->keyFor($runtime->family, $runtime->mode);
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
            ['/srv/journal/workspaces/main', '/srv/journal/accounts/01plain', "acme-history-{$opened->sessionId}"],
            array_map(fn ($mount) => $mount->source, $manifest->mounts),
        );
        $this->assertTrue($manifest->mounts[0]->writable);
        $wire = json_decode(json_encode($grant->toArray(), JSON_THROW_ON_ERROR), true, 512, JSON_THROW_ON_ERROR);
        $this->assertTrue($wire['container']['attachable']);
        $this->assertSame('daemon-bind', $wire['container']['mounts'][0]['type']);
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
            new ReportRuntimeHeartbeatCommand($host->hostId, $opened->runtimeId, $generation, 'owned process alive'),
        );

        $this->assertNotNull(AgentSession::query()->findOrFail($opened->sessionId)->last_heartbeat_at);
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
        $claimed = $this->claimedScript($host, $refused->requestId);
        $runtime = AgentRuntime::query()->findOrFail($opened->runtimeId);
        $this->assertSame(
            [$runtime->agent_session_id, $runtime->process_generation],
            [$claimed['sessionId'], $claimed['processGeneration']],
        );
        $attempts = DriverRequest::query()
            ->whereKey([$refused->requestId, $unnamed->requestId])
            ->limit(2)
            ->pluck('attempt_version', 'id');
        $reports = [[$refused, 'container-unavailable'], [$unnamed, 'disk-on-fire']];

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
        $this->assertSame([$againId, $original->id, 'Hello'], [$repeated, $again->possible_duplicate_of_id, $again->message]);
        $this->assertSame(RequestProgress::DeliveryUncertain, $original->fresh()?->progress);
    }

    public function test_an_agent_names_its_running_session_by_the_label_it_launched_on(): void
    {
        [, $opened] = $this->openRuntime();
        $runtime = AgentRuntime::query()->findOrFail($opened->runtimeId);

        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser('owner'), new OwnerAuthority('test'));
        $option = $this->app->make(AgentDirectory::class)->visibleAgent($this->agentIdOf($opened));

        $this->assertSame($runtime->driver_label, $option->sessionDriverLabel);
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

    private function deliver(OpenedRuntime $opened, string $key, string $message): DriverReceipt
    {
        return $this->asOwner(new DeliverAgentCommand($this->agentIdOf($opened), $opened->sessionId, $key, $message));
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
