<?php

declare(strict_types=1);

namespace Tests\Machinery\Hosts;

use App\Enums\Hosts\HostProcessPurpose;
use App\Support\Drivers\DriverSupervisor;
use App\Support\Hosts\HostWake;
use Tests\Support\Drivers\StandInProgramDriver;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The supervisor starts one worker for each live process a program driver drives, and none for a process no driver
 * drives.
 */
#[TestsMachinery(DriverSupervisor::class)]
final class DriverSupervisorTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_driven_process_gets_its_worker_once(): void
    {
        $this->journal
            ->fakeStartedPrograms()
            ->driveProcessesWith(HostProcessPurpose::Probe, StandInProgramDriver::class)
            ->enrollHost('Mac', [base_path()])
            ->openHostProcess('Mac', 'shell');
        $process = $this->journal->hostProcessCalled('shell')->id;
        $supervisor = $this->journal->service(DriverSupervisor::class);

        $started = $supervisor->startNeeded();

        $this->journal
            ->assertProgramStarted(['php', 'artisan', 'drivers:work', $process])
            ->assertResult([$process], $started);
    }

    public function test_a_new_process_wakes_the_supervisor_which_otherwise_waits_without_a_timer(): void
    {
        $this->journal->driveProcessesWith(HostProcessPurpose::Probe, StandInProgramDriver::class);
        $supervisor = $this->journal->service(DriverSupervisor::class);
        $wake = $this->journal->service(HostWake::class);
        $wake->waitForSupervisor(1);

        $this->journal->enrollHost('Mac', [base_path()])->openHostProcess('Mac', 'shell');

        $this->journal->assertResult(
            [true, DriverSupervisor::UNTIL_WOKEN],
            [$wake->waitForSupervisor(1), $supervisor->secondsUntilNextLeaseEnd()],
        );
    }
}
