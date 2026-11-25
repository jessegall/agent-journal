<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Processes\OutputSummary;
use App\Api\Processes\ReadOutputSummaryPayload;
use App\Attributes\Bus\Dispatches;
use App\Commands\CommandRules\RecordEvidenceReads\RecordEvidenceReadsCommand;
use App\Models\Runs\ProcessRun;
use App\Support\OutputSummaries;

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
