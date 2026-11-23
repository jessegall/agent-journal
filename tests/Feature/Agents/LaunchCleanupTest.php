<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Commands\ReportCleanup\ReportCleanupCommand;
use App\Contracts\Drivers\DriverCatalogue;
use App\Enums\CapacityResource;
use App\Enums\CleanupState;
use App\Enums\CleanupStep;
use App\Enums\ConversationModeType;
use App\Enums\DriverVariant;
use App\Enums\ReservationState;
use App\Enums\StartOriginType;
use App\Exceptions\CapacityUnavailable;
use App\Models\Agents\AgentRuntime;
use App\Models\Starts\CapacityReservation;
use App\Models\Starts\CleanupOperation;
use App\Models\Starts\RevisionFence;
use App\Models\Starts\SessionPolicy;
use App\Models\Starts\StartRecord;
use App\Support\ActorIdentity;
use App\Support\LaunchLimits;
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
 * An ended container launch is cleaned up durably (task 419): a full pass removes its transient resources and only
 * then releases its capacity, a failed pass keeps the dirty workspace as the recovery location and retries, a repeated
 * pass changes nothing more, and a launch past its wall budget or from a revoked revision is stopped.
 */
#[TimeLimit(seconds: 4, reason: 'It starts test agent sessions and opens their runtimes.')]
final class LaunchCleanupTest extends TestCase
{
    use RefreshHookDatabase;
    use RunsTrustedCommands;

    private const array ALL_STEPS = [CleanupStep::Container, CleanupStep::Network, CleanupStep::Runtime];

    public function test_a_full_pass_removes_the_launch_resources_and_then_releases_its_capacity(): void
    {
        $launch = $this->endedContainerLaunch();

        $this->assertSame(CleanupState::Pending, $this->cleanupOf($launch)->state);
        $this->assertSame(ReservationState::Reserved, $this->reservationOf($launch)->state);

        $state = $this->report($launch, new CleanupReport(self::ALL_STEPS, null, null));

        $this->assertSame(CleanupState::Done, $state);
        $this->assertSame(ReservationState::Released, $this->reservationOf($launch)->state);
        $this->assertNull($this->cleanupOf($launch)->recovery_location);
    }

    public function test_a_crashed_dirty_launch_keeps_its_workspace_and_a_repeated_pass_changes_nothing(): void
    {
        $launch = $this->endedContainerLaunch();

        $failed = new CleanupReport(
            [CleanupStep::Container],
            '/workspaces/helper-7',
            'removing the network failed: daemon busy',
        );
        $this->assertSame(CleanupState::Pending, $this->report($launch, $failed));
        $this->assertSame(ReservationState::Reserved, $this->reservationOf($launch)->state);
        $pending = $this->cleanupOf($launch);
        $this->assertSame('/workspaces/helper-7', $pending->recovery_location);
        $this->assertSame([CleanupStep::Network, CleanupStep::Runtime], $pending->remainingSteps());

        $retried = new CleanupReport([CleanupStep::Network, CleanupStep::Runtime], null, null);
        $this->report($launch, $retried);
        $again = new CleanupReport(self::ALL_STEPS, null, 'late failure');
        $this->assertSame(CleanupState::Done, $this->report($launch, $again));

        $done = $this->cleanupOf($launch);
        $this->assertSame(1, $done->attempts);
        $this->assertNull($done->last_error);
        $this->assertSame('/workspaces/helper-7', $done->recovery_location);
    }

    public function test_a_launch_that_never_opened_a_runtime_releases_its_capacity_at_once(): void
    {
        $launch = TestStart::start('writing-helper');
        $launch->openStack($this->app);
        $this->reserve($launch);

        $this->app->make(StartHeartbeats::class)->markExited($launch->session, 'exit 1');

        $this->assertSame(ReservationState::Released, $this->reservationOf($launch)->state);
        $this->assertSame(0, CleanupOperation::query()->count());
    }

    public function test_a_start_past_the_host_capacity_is_refused_unless_the_owner_switched_the_guard_off(): void
    {
        $budgets = ExecutionBudgets::defaults();
        $room = new HostCapacity($budgets->cpuCores, $budgets->memoryBytes, $budgets->workspaceBytes);
        CapacityReservation::reserve('start-1', $budgets, $room);

        $this->assertThrows(
            fn () => CapacityReservation::reserve('start-2', $budgets, $room),
            CapacityUnavailable::class,
        );

        $unguarded = new HostCapacity($budgets->cpuCores, $budgets->memoryBytes, $budgets->workspaceBytes, false);
        CapacityReservation::reserve('start-2', $budgets, $unguarded);
        $this->assertTrue(CapacityReservation::isHeldFor('start-2'));
    }

    public function test_check_capacity_names_the_shortage_while_held_and_fits_once_one_cleanup_releases_it(): void
    {
        $launch = $this->endedContainerLaunch();
        $budgets = ExecutionBudgets::defaults();
        $room = new HostCapacity($budgets->cpuCores, $budgets->memoryBytes, $budgets->workspaceBytes);

        $this->assertSame(CapacityResource::Cpu, CapacityReservation::shortageOf($budgets, $room));
        $this->assertSame(1, CapacityReservation::query()->count());

        $this->report($launch, new CleanupReport(self::ALL_STEPS, null, null));
        $this->assertNull(CapacityReservation::shortageOf($budgets, $room));

        CapacityReservation::reserve('start-other', $budgets, $room);
        $this->assertSame(CleanupState::Done, $this->report($launch, new CleanupReport(self::ALL_STEPS, null, null)));
        $this->assertTrue(CapacityReservation::isHeldFor('start-other'));
        $this->assertSame(ReservationState::Released, $this->reservationOf($launch)->state);
    }

    public function test_a_launch_past_its_wall_budget_is_stopped_and_a_younger_one_runs_on(): void
    {
        $this->travel(-7)->hours();
        $old = $this->runningLaunch();
        $this->travelBack();
        $young = $this->runningLaunch();

        $this->app->make(LaunchLimits::class)->stopOverdue();

        $this->assertFalse(AgentRuntime::isRunningForSession($old->session->id));
        $this->assertTrue(AgentRuntime::isRunningForSession($young->session->id));
    }

    public function test_a_fence_stops_the_sessions_of_its_revision_and_is_reconciled_once_none_runs(): void
    {
        $launch = $this->runningLaunch();
        $fence = RevisionFence::retain($launch->session->profile_key, $launch->session->profile_revision);
        $limits = $this->app->make(LaunchLimits::class);

        $limits->enforceFences();

        $this->assertFalse(AgentRuntime::isRunningForSession($launch->session->id));
        $this->assertTrue(RevisionFence::isPending($fence->profile_key, $fence->profile_revision));

        $this->app->make(StartHeartbeats::class)->markExited($launch->session, 'exit 0');
        $limits->enforceFences();

        $this->assertFalse(RevisionFence::isPending($fence->profile_key, $fence->profile_revision));
    }

    private function endedContainerLaunch(): TestStart
    {
        $launch = TestStart::start('writing-helper');
        $launch->openRuntime($this->app);
        $launch->openStack($this->app);
        $this->reserve($launch);

        $this->app->make(StartHeartbeats::class)->markExited($launch->session, 'exit 0');

        return $launch;
    }

    /**
     * A launch for an owner's work, running in its runtime with the default budgets frozen with it.
     */
    private function runningLaunch(): TestStart
    {
        $launch = TestStart::start('writing-helper');
        $launch->openRuntime($this->app);
        $launch->openStack($this->app);
        $request = new StartRequest(
            $launch->session->start_request_id,
            $launch->agent->id,
            SelectedDriver::resolve('claude-code', ModelSelection::named('claude-opus-5-5'), null, null, $this->app->make(DriverCatalogue::class)),
            StartOriginType::OwnerRequest,
            'helpers.job:01m7wgahp0n7766x1e1ta8ehew',
            null,
            ConversationModeType::New,
            null,
            StartPolicy::withoutProfile(TestSelections::onHost()),
            variant: DriverVariant::Headless,
        );
        StartRecord::accept($request, TestSelections::pinOf($request), ActorIdentity::system(), None::create())->startedAs($launch->session);
        SessionPolicy::create($launch->session, $request->policy);

        return $launch;
    }

    private function reserve(TestStart $launch): void
    {
        $capacity = new HostCapacity(8, 16 * 1024 ** 3, 50 * 1024 ** 3);
        CapacityReservation::reserve($launch->session->start_request_id, ExecutionBudgets::defaults(), $capacity);
    }

    private function report(TestStart $launch, CleanupReport $report): CleanupState
    {
        return $this->asSystem(new ReportCleanupCommand('host-1', $launch->session->id, $report));
    }

    private function cleanupOf(TestStart $launch): CleanupOperation
    {
        return CleanupOperation::query()->where('agent_session_id', $launch->session->id)->sole();
    }

    private function reservationOf(TestStart $launch): CapacityReservation
    {
        return CapacityReservation::query()->where('start_request_id', $launch->session->start_request_id)->sole();
    }
}
