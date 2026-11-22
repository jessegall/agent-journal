<?php

declare(strict_types=1);

namespace App\Pipes\Run;

use App\Calls\Processes\ProcessCalls;
use App\Contracts\Pipe;
use App\Support\Run\PartResult;
use App\Support\Run\SupervisedRun;
use App\Values\CommandReport;

/**
 * Reports the output number and each part's result as the receipt gate answers it, never a pass read from the exit.
 */
final readonly class ReportPartResults implements Pipe
{
    public function __construct(private ProcessCalls $processes) {}

    public function handle(SupervisedRun $run): CommandReport
    {
        $summary = $this->processes->readOutputSummary($run->runId);
        $report = $run->report->line('')->line("Output {$run->runId}: read it with journal output read {$run->runId}");

        foreach ($summary->parts as $part) {
            $report = $report->line("{$part->operation}: ".PartResult::fromAnswer($part->partSummary)->describe());
        }

        return $report;
    }
}
