<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Bus\Attributes\Dispatches;
use App\CommandRules\Commands\RecordEvidenceReads\RecordEvidenceReadsCommand;
use App\Models\Runs\ProcessRun;
use App\Processes\Api\OutputSummary;
use App\Processes\Api\ReadOutputSummaryPayload;
use App\Processes\OutputSummaries;

/**
 * Answers a run's output summary and records the read.
 */
final readonly class ReadOutputSummaryController
{
    #[Dispatches(RecordEvidenceReadsCommand::class)]
    public function __invoke(
        ReadOutputSummaryPayload $call,
        ProcessRun $processRun,
        OutputSummaries $summaries,
    ): OutputSummary {
        return $summaries->of($processRun);
    }
}
