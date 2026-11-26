<?php

declare(strict_types=1);

namespace Tests\Architecture\Seeding;

use App\Enums\Hosts\HostOrderStatus;
use App\Enums\Hosts\HostOrderType;
use App\Enums\Hosts\HostProcessPurpose;
use App\Enums\Hosts\HostProcessReportType;
use App\Enums\Hosts\HostProcessStatus;
use App\Enums\Hosts\HostProcessType;
use App\Support\Drivers\DriverSupervisor;
use App\Support\Hosts\ProcessFeed;
use Tests\Support\Drivers\StandInProgramDriver;
use Tests\TestCase;

/**
 * The test journal opens a host's processes through their real open order and moves them by their host's reports.
 */
final class JournalHostProcessesTest extends TestCase
{
    public function test_a_process_is_opened_by_its_order_and_moved_by_its_hosts_report(): void
    {
        $this->journal->enrollHost('Mac', [base_path()])->openHostProcess('Mac', 'pipe', HostProcessType::Pipe);
        [$open] = $this->journal->hostOrdersOf('pipe');

        $this->journal->reportHostProcess('pipe', HostProcessReportType::Running);

        $this->journal->assertResult(
            [HostOrderType::OpenProcess, HostProcessType::Pipe, HostProcessStatus::Running, 'pid:pipe'],
            [
                $open->type,
                $this->journal->hostProcessCalled('pipe')->type,
                $this->journal->hostProcessCalled('pipe')->status,
                $this->journal->hostProcessCalled('pipe')->execution_identity,
            ],
        );
    }

    public function test_a_driven_process_prints_has_its_order_answered_and_its_worker_started(): void
    {
        $this->journal
            ->fakeStartedPrograms()
            ->driveProcessesWith(HostProcessPurpose::Probe, StandInProgramDriver::class)
            ->enrollHost('Mac', [base_path()])
            ->openHostProcess('Mac', 'shell')
            ->printOnHostProcess('shell', 'ready');
        [$open] = $this->journal->hostOrdersOf('shell');
        $process = $this->journal->hostProcessCalled('shell')->id;

        $this->journal->answerHostOrder($open);
        $this->journal->service(DriverSupervisor::class)->startNeeded();

        $this->journal
            ->assertProgramStarted(['php', 'artisan', 'drivers:work', $process])
            ->assertResult(
                [HostOrderStatus::Done, 'ready'],
                [$open->refresh()->status, $this->journal->service(ProcessFeed::class)->latestFrame($process)?->rows[0]],
            );
    }
}
