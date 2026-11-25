<?php

declare(strict_types=1);

namespace Tests\Commands\Sessions;

use App\Commands\Sessions\NotifyCleanup\NotifyCleanupCommand;
use App\Enums\Sessions\CapacityResource;
use App\Enums\Sessions\CleanupStatus;
use App\Enums\Sessions\CleanupStep;
use App\Enums\Sessions\ReservationStatus;
use App\Models\Sessions\CapacityReservation;
use App\Models\Sessions\SessionCleanup;
use App\Support\StartHeartbeats;
use App\Values\CleanupReport;
use App\Values\ExecutionBudgets;
use App\Values\HostCapacity;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A cleanup pass removes an ended start's resources and then releases its capacity; a crashed dirty start keeps its
 * workspace, and a repeated pass changes nothing.
 */
#[TimeLimit(seconds: 4, reason: 'It starts test agent sessions and opens their runtimes.')]
#[TestsCommand(NotifyCleanupCommand::class)]
final class NotifyCleanupTest extends TestCase
{
    use RefreshHookDatabase;

    private const array ALL_STEPS = [CleanupStep::Container, CleanupStep::Network, CleanupStep::Runtime];

    public function test_a_full_pass_removes_the_start_resources_and_then_releases_its_capacity(): void
    {
        $start = $this->endedContainerStart();

        $this->assertSame(CleanupStatus::Pending, $this->cleanupOf($start)->status);
        $this->assertSame(ReservationStatus::Reserved, $this->reservationOf($start)->status);

        $state = $this->notify($start, new CleanupReport(self::ALL_STEPS, null, null));

        $this->assertSame(CleanupStatus::Done, $state);
        $this->assertSame(ReservationStatus::Released, $this->reservationOf($start)->status);
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
        $this->assertSame(CleanupStatus::Pending, $this->notify($start, $failed));
        $this->assertSame(ReservationStatus::Reserved, $this->reservationOf($start)->status);
        $pending = $this->cleanupOf($start);
        $this->assertSame('/workspaces/helper-7', $pending->recovery_location);
        $this->assertSame([CleanupStep::Network, CleanupStep::Runtime], $pending->remainingSteps());

        $retried = new CleanupReport([CleanupStep::Network, CleanupStep::Runtime], null, null);
        $this->notify($start, $retried);
        $again = new CleanupReport(self::ALL_STEPS, null, 'late failure');
        $this->assertSame(CleanupStatus::Done, $this->notify($start, $again));

        $done = $this->cleanupOf($start);
        $this->assertSame(1, $done->attempts);
        $this->assertNull($done->last_error);
        $this->assertSame('/workspaces/helper-7', $done->recovery_location);
    }

    public function test_check_capacity_names_the_shortage_while_held_and_fits_once_one_cleanup_releases_it(): void
    {
        $start = $this->endedContainerStart();
        $budgets = ExecutionBudgets::defaults();
        $room = new HostCapacity($budgets->cpuCores, $budgets->memoryBytes, $budgets->workspaceBytes);

        $this->assertSame(CapacityResource::Cpu, CapacityReservation::resolveShortageOf($budgets, $room));
        $this->assertSame(1, CapacityReservation::query()->count());

        $this->notify($start, new CleanupReport(self::ALL_STEPS, null, null));
        $this->assertNull(CapacityReservation::resolveShortageOf($budgets, $room));

        CapacityReservation::create('start-other', $budgets, $room);
        $this->assertSame(CleanupStatus::Done, $this->notify($start, new CleanupReport(self::ALL_STEPS, null, null)));
        $this->assertTrue(CapacityReservation::isHeldFor('start-other'));
        $this->assertSame(ReservationStatus::Released, $this->reservationOf($start)->status);
    }

    private function endedContainerStart(): TestStart
    {
        $start = $this->journal->signedStart('Test agent', 'writing-helper');
        $start->openRuntime($this->app);
        $start->openStack($this->app);
        $this->reserve($start);

        $this->app->make(StartHeartbeats::class)->markExited($start->session, 'exit 0');

        return $start;
    }

    private function reserve(TestStart $start): void
    {
        $capacity = new HostCapacity(8, 16 * 1024 ** 3, 50 * 1024 ** 3);
        CapacityReservation::create($start->session->start_request_id, ExecutionBudgets::defaults(), $capacity);
    }

    private function notify(TestStart $start, CleanupReport $report): CleanupStatus
    {
        return $this->journal->asSystem(new NotifyCleanupCommand('host-1', $start->session->id, $report));
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
