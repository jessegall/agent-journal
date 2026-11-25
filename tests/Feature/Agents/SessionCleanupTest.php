<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Commands\Sessions\NotifyCleanup\NotifyCleanupCommand;
use App\Contracts\Drivers\DriverCatalogue;
use App\Enums\Agents\ConversationModeType;
use App\Enums\Drivers\DriverType;
use App\Enums\Sessions\CapacityResource;
use App\Enums\Sessions\CleanupState;
use App\Enums\Sessions\CleanupStep;
use App\Enums\Sessions\ReservationState;
use App\Enums\Sessions\StartOriginType;
use App\Exceptions\CapacityUnavailable;
use App\Models\Agents\AgentRuntime;
use App\Models\Profiles\ProfileRevisionHold;
use App\Models\Sessions\CapacityReservation;
use App\Models\Sessions\SessionCleanup;
use App\Models\Sessions\SessionPolicy;
use App\Models\Sessions\SessionRequest;
use App\Support\ActorIdentity;
use App\Support\RecordIdentity;
use App\Support\SessionStartLimits;
use App\Support\StartHeartbeats;
use App\Values\CleanupReport;
use App\Values\ExecutionBudgets;
use App\Values\HostCapacity;
use App\Values\ModelSelection;
use App\Values\SelectedDriver;
use App\Values\StartPolicy;
use App\Values\StartRequest;
use PhpOption\None;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * An ended container start is cleaned up durably: a full pass removes its transient resources and only
 * then releases its capacity, a failed pass keeps the dirty workspace as the recovery location and retries, a repeated
 * pass changes nothing more, and a start past its wall budget or from a revoked revision is stopped.
 */
#[TimeLimit(seconds: 4, reason: 'It starts test agent sessions and opens their runtimes.')]
final class SessionCleanupTest extends TestCase
{
    use RefreshHookDatabase;
    use RunsTrustedCommands;

    private const array ALL_STEPS = [CleanupStep::Container, CleanupStep::Network, CleanupStep::Runtime];

    public function test_a_full_pass_removes_the_start_resources_and_then_releases_its_capacity(): void
    {
        $start = $this->endedContainerStart();

        $this->assertSame(CleanupState::Pending, $this->cleanupOf($start)->state);
        $this->assertSame(ReservationState::Reserved, $this->reservationOf($start)->state);

        $state = $this->notify($start, new CleanupReport(self::ALL_STEPS, null, null));

        $this->assertSame(CleanupState::Done, $state);
        $this->assertSame(ReservationState::Released, $this->reservationOf($start)->state);
        $this->assertNull($this->cleanupOf($start)->recovery_location);
    }

    public function test_a_crashed_dirty_start_keeps_its_workspace_and_a_repeated_pass_changes_nothing(): void
    {
        $start = $this->endedContainerStart();

        $failed = new CleanupReport(
            [CleanupStep::Container],
            '/workspaces/helper-7',
            'removing the network failed: daemon busy',
        );
        $this->assertSame(CleanupState::Pending, $this->notify($start, $failed));
        $this->assertSame(ReservationState::Reserved, $this->reservationOf($start)->state);
        $pending = $this->cleanupOf($start);
        $this->assertSame('/workspaces/helper-7', $pending->recovery_location);
        $this->assertSame([CleanupStep::Network, CleanupStep::Runtime], $pending->remainingSteps());

        $retried = new CleanupReport([CleanupStep::Network, CleanupStep::Runtime], null, null);
        $this->notify($start, $retried);
        $again = new CleanupReport(self::ALL_STEPS, null, 'late failure');
        $this->assertSame(CleanupState::Done, $this->notify($start, $again));

        $done = $this->cleanupOf($start);
        $this->assertSame(1, $done->attempts);
        $this->assertNull($done->last_error);
        $this->assertSame('/workspaces/helper-7', $done->recovery_location);
    }

    public function test_a_start_that_never_opened_a_runtime_releases_its_capacity_at_once(): void
    {
        $start = TestStart::start('writing-helper');
        $start->openStack($this->app);
        $this->reserve($start);

        $this->app->make(StartHeartbeats::class)->markExited($start->session, 'exit 1');

        $this->assertSame(ReservationState::Released, $this->reservationOf($start)->state);
        $this->assertSame(0, SessionCleanup::query()->count());
    }

    public function test_a_start_past_the_host_capacity_is_refused_unless_the_owner_switched_the_guard_off(): void
    {
        $budgets = ExecutionBudgets::defaults();
        $room = new HostCapacity($budgets->cpuCores, $budgets->memoryBytes, $budgets->workspaceBytes);
        CapacityReservation::create('start-1', $budgets, $room);

        $this->assertThrows(
            fn () => CapacityReservation::create('start-2', $budgets, $room),
            CapacityUnavailable::class,
        );

        $unguarded = new HostCapacity($budgets->cpuCores, $budgets->memoryBytes, $budgets->workspaceBytes, false);
        CapacityReservation::create('start-2', $budgets, $unguarded);
        $this->assertTrue(CapacityReservation::isHeldFor('start-2'));
    }

    public function test_check_capacity_names_the_shortage_while_held_and_fits_once_one_cleanup_releases_it(): void
    {
        $start = $this->endedContainerStart();
        $budgets = ExecutionBudgets::defaults();
        $room = new HostCapacity($budgets->cpuCores, $budgets->memoryBytes, $budgets->workspaceBytes);

        $this->assertSame(CapacityResource::Cpu, CapacityReservation::shortageOf($budgets, $room));
        $this->assertSame(1, CapacityReservation::query()->count());

        $this->notify($start, new CleanupReport(self::ALL_STEPS, null, null));
        $this->assertNull(CapacityReservation::shortageOf($budgets, $room));

        CapacityReservation::create('start-other', $budgets, $room);
        $this->assertSame(CleanupState::Done, $this->notify($start, new CleanupReport(self::ALL_STEPS, null, null)));
        $this->assertTrue(CapacityReservation::isHeldFor('start-other'));
        $this->assertSame(ReservationState::Released, $this->reservationOf($start)->state);
    }

    public function test_a_start_past_its_wall_budget_is_stopped_and_a_younger_one_runs_on(): void
    {
        $this->travel(-7)->hours();
        $old = $this->runningStart();
        $this->travelBack();
        $young = $this->runningStart();

        $this->app->make(SessionStartLimits::class)->stopOverdue();

        $this->assertFalse(AgentRuntime::isRunningForSession($old->session->id));
        $this->assertTrue(AgentRuntime::isRunningForSession($young->session->id));
    }

    public function test_a_fence_stops_the_sessions_of_its_revision_and_is_reconciled_once_none_runs(): void
    {
        $start = $this->runningStart();
        $fence = ProfileRevisionHold::retain($start->session->profile_key, $start->session->profile_revision);
        $limits = $this->app->make(SessionStartLimits::class);

        $limits->enforceFences();

        $this->assertFalse(AgentRuntime::isRunningForSession($start->session->id));
        $this->assertTrue(ProfileRevisionHold::query()->whereKey($fence->id)->whereNull('reconciled_at')->exists());

        $this->app->make(StartHeartbeats::class)->markExited($start->session, 'exit 0');
        $limits->enforceFences();

        $this->assertFalse(ProfileRevisionHold::query()->whereKey($fence->id)->whereNull('reconciled_at')->exists());
    }

    private function endedContainerStart(): TestStart
    {
        $start = TestStart::start('writing-helper');
        $start->openRuntime($this->app);
        $start->openStack($this->app);
        $this->reserve($start);

        $this->app->make(StartHeartbeats::class)->markExited($start->session, 'exit 0');

        return $start;
    }

    /**
     * A start for an owner's work, running in its runtime with the default budgets frozen with it.
     */
    private function runningStart(): TestStart
    {
        $start = TestStart::start('writing-helper');
        $start->openRuntime($this->app);
        $start->openStack($this->app);
        $request = new StartRequest(
            $start->session->start_request_id,
            $start->agent->id,
            SelectedDriver::resolve('claude-code', ModelSelection::named('claude-opus-5-5'), null, null, $this->app->make(DriverCatalogue::class)),
            StartOriginType::OwnerRequest,
            new RecordIdentity('helpers.helper-job', '01m7wgahp0n7766x1e1ta8ehew'),
            null,
            ConversationModeType::New,
            null,
            StartPolicy::withoutProfile(TestSelections::onHost()),
            driverType: DriverType::Headless,
        );
        SessionRequest::create($request, TestSelections::pinOf($request), ActorIdentity::system(), None::create())->startedAs($start->session);
        SessionPolicy::create($start->session, $request->policy);

        return $start;
    }

    private function reserve(TestStart $start): void
    {
        $capacity = new HostCapacity(8, 16 * 1024 ** 3, 50 * 1024 ** 3);
        CapacityReservation::create($start->session->start_request_id, ExecutionBudgets::defaults(), $capacity);
    }

    private function notify(TestStart $start, CleanupReport $report): CleanupState
    {
        return $this->asSystem(new NotifyCleanupCommand('host-1', $start->session->id, $report));
    }

    private function cleanupOf(TestStart $start): SessionCleanup
    {
        return SessionCleanup::query()->where('agent_session_id', $start->session->id)->sole();
    }

    private function reservationOf(TestStart $start): CapacityReservation
    {
        return CapacityReservation::query()->where('start_request_id', $start->session->start_request_id)->sole();
    }
}
