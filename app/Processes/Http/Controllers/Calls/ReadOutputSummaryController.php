<?php

declare(strict_types=1);

namespace App\Processes\Http\Controllers\Calls;

use App\Processes\Calls\OutputSummary;
use App\Processes\Calls\ReadOutputSummaryCall;
use App\Processes\Models\ProcessRun;
use App\Processes\Support\OutputSummaries;

/**
 * Answers a run's output summary and records the read.
 */
final readonly class ReadOutputSummaryController
{
    public function __invoke(
        ReadOutputSummaryCall $call,
        ProcessRun $processRun,
        OutputSummaries $summaries,
    ): OutputSummary {
        return $summaries->of($processRun);
    }
}
