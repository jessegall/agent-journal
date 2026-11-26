<?php

declare(strict_types=1);

namespace Tests\Machinery\Hosts;

use App\Enums\Hosts\HostProcessPurpose;
use App\Support\Drivers\DriverSupervisor;
use Tests\Support\Drivers\StandInProgramDriver;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\TestCase;

/**
 * The supervisor starts one worker for each live process a program driver drives, and none for a process no driver
 * drives.
 */
#[TestsMachinery(DriverSupervisor::class)]
final class DriverSupervisorTest extends TestCase
{
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
}
