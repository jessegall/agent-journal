<?php

declare(strict_types=1);

namespace Tests\Middleware;

use App\Agents\Drivers\Work\WorkerLease;
use App\Bus\CommandMiddleware\FenceDriverWorker;
use App\Exceptions\WorkerFenced;
use App\Hosts\Commands\ClaimHostWorker\ClaimHostWorkerCommand;
use App\Hosts\Commands\NotifyHostProcess\NotifyHostProcessCommand;
use App\Hosts\Data\HostProcessReportData;
use App\Hosts\Enums\HostProcessStatus;
use Tests\Support\Entries\Attributes\TestsMiddleware;
use Tests\Support\Hosts\TestEnrolledHost;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Every command a driver worker runs is refused once another worker took its process over, a report as much as an
 * order; the worker that holds the process runs it.
 */
#[TestsMiddleware(FenceDriverWorker::class)]
final class FenceDriverWorkerTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_deposed_workers_report_is_refused_and_the_current_workers_goes_through(): void
    {
        $this->journal->enrollHost('Mac', [base_path()])->host('Mac', fn (TestEnrolledHost $mac) => $mac->openProcess('shell'));
        $process = $this->journal->hostProcessCalled('shell');
        $deposed = $this->journal->asSystem(new ClaimHostWorkerCommand($process->id));
        $current = $this->journal->asSystem(new ClaimHostWorkerCommand($process->id));
        $report = new NotifyHostProcessCommand(
            $process->host_id,
            $process->id,
            HostProcessReportData::from(['report' => 'running', 'identity' => 'pid:1']),
        );
        $lease = $this->journal->service(WorkerLease::class);

        $this->journal
            ->assertRefused(
                WorkerFenced::class,
                fn () => $lease->hold($process->id, $deposed, fn () => $this->journal->asSystem($report)),
            )
            ->assertResult(HostProcessStatus::Ordered, $this->journal->hostProcessCalled('shell')->status);
        $lease->hold($process->id, $current, fn () => $this->journal->asSystem($report));

        $this->journal->assertResult(HostProcessStatus::Running, $this->journal->hostProcessCalled('shell')->status);
    }
}
