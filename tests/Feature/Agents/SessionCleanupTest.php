<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Commands\Sessions\NotifyCleanup\NotifyCleanupCommand;
use App\Enums\Sessions\CapacityResource;
use App\Enums\Sessions\CleanupStatus;
use App\Enums\Sessions\CleanupStep;
use App\Enums\Sessions\ReservationStatus;
use App\Models\Sessions\CapacityReservation;
use App\Support\StartHeartbeats;
use App\Values\CleanupReport;
use App\Values\ExecutionBudgets;
use App\Values\HostCapacity;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A start's capacity on its host: a start that never opened a runtime releases its capacity at once, a start past the
 * host's capacity is refused unless the owner switched the guard off, and a capacity check names the shortage while it
 * is held and fits once a cleanup releases it.
 */
#[TimeLimit(seconds: 4, reason: 'It starts test agent sessions and opens their runtimes.')]
final class SessionCleanupTest extends TestCase
{
    use RefreshHookDatabase;

    private const array ALL_STEPS = [CleanupStep::Container, CleanupStep::Network, CleanupStep::Runtime];

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
        $start = TestStart::start('writing-helper');
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

    private function reservationOf(TestStart $start): CapacityReservation
    {
        return CapacityReservation::query()->where('start_request_id', $start->session->start_request_id)->sole();
    }
}
