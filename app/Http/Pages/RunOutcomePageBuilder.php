<?php

declare(strict_types=1);

namespace App\Http\Pages;

use App\Http\Requests\Processes\RunPageRequest;
use App\Processes\Data\RunOutcomePageData;
use App\Processes\Data\RunOutcomeSummaryData;
use App\Processes\Resolvers\Support\RunOutcomeSummaries;
use App\Reads\PageFormRequests;
use App\Web\Creation\Contracts\PageBuilder;
use Illuminate\Http\Request;
use Spatie\LaravelData\Optional;

/**
 * A run's outcome-only page, where a run notification leads: its safe summary, or nothing once the reader may no
 * longer hear of it.
 */
final readonly class RunOutcomePageBuilder implements PageBuilder
{
    public function __construct(
        private PageFormRequests $requests,
        private RunOutcomeSummaries $summaries,
    ) {}

    public function build(Request $visit): RunOutcomePageData
    {
        $input = $this->requests->forVisit(RunPageRequest::class, $visit);

        $runId = $input->runId();

        return RunOutcomePageData::build()
            ->runId($runId)
            ->summary(
                $this->summaries->summaryOf($runId)
                    ->map(fn (RunOutcomeSummaryData $summary) => $summary)
                    ->getOrElse(Optional::create()),
            )
            ->finish();
    }
}
