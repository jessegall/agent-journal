<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Run;

use App\AgentRequests\Contracts\AgentRequestSender;
use App\Pipelines\Contracts\Pipe;
use App\Processes\Values\Run\PartResult;
use App\Processes\Values\Run\RunReport;
use App\Processes\Values\Run\SupervisedRun;

/**
 * Reports the output number and each part's result as the receipt gate answers it, never a pass read from the exit.
 */
final readonly class ReportPartResults implements Pipe
{
    public function __construct(private AgentRequestSender $journal) {}

    public function handle(SupervisedRun $run): RunReport
    {
        $summary = $this->journal->send("/agent/processes/runs/{$run->runId}/output", ['mode' => 'summary'])->body;
        $report = $run->report->line('')->line("Output {$run->runId}: read it with journal output read {$run->runId}");

        foreach ($summary['parts'] as $part) {
            $report = $report->line("{$part['operation']}: ".PartResult::fromAnswer($part['result'])->describe());
        }

        return $report;
    }
}
