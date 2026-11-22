<?php

declare(strict_types=1);

namespace App\Processes\Resolvers;

use App\Http\Requests\Processes\RunPageRequest;
use App\Processes\Data\RunOutcomePageData;
use App\Processes\Data\RunOutcomeSummaryData;
use App\Processes\Resolvers\Support\RunOutcomeSummaries;
use App\Ui\Contracts\PageResolver;
use Spatie\LaravelData\Optional;

/**
 * A run's outcome-only page, where a run notification leads: its safe summary, or nothing once the reader may no
 * longer hear of it.
 */
final readonly class RunOutcomeWindowResolver implements PageResolver
{
    public function __construct(
        private RunPageRequest $page,
        private RunOutcomeSummaries $summaries,
    ) {}

    public function read(): RunOutcomePageData
    {
        $runId = $this->page->runId();

        return new RunOutcomePageData(
            $runId,
            $this->summaries->summaryOf($runId)
                ->map(fn (RunOutcomeSummaryData $summary) => $summary)
                ->getOrElse(Optional::create()),
        );
    }
}
