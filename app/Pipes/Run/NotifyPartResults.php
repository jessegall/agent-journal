<?php

declare(strict_types=1);

namespace App\Pipes\Run;

use App\Api\Processes\ProcessApi;
use App\Bus\Contracts\Pipe;
use App\Mcp\Tools\OutputsReadTool;
use App\Processes\Run\PartResult;
use App\Support\Run\SupervisedRun;
use App\Values\CommandReport;

/**
 * Reports the output number and each part's result as the receipt gate answers it, never a pass read from the exit.
 */
final readonly class NotifyPartResults implements Pipe
{
    private const string READ_OUTPUT_LINE = 'Output %1$s: read it with the %2$s tool, run %1$s.';

    public function __construct(private ProcessApi $processes) {}

    public function handle(SupervisedRun $run): CommandReport
    {
        $summary = $this->processes->readOutputSummary($run->runId);
        $report = $run->report->line('')->line(sprintf(self::READ_OUTPUT_LINE, $run->runId, OutputsReadTool::NAME));

        foreach ($summary->parts as $part) {
            $report = $report->line("{$part->operation}: ".PartResult::fromAnswer($part->partSummary)->describe());
        }

        return $report;
    }
}
