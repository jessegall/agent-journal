<?php

declare(strict_types=1);

namespace App\Http\Pages\Resolvers;

use App\Contracts\Navigation\PageResolver;
use App\Data\Processes\RunOutcomePageData;
use App\Data\Processes\RunOutcomeSummaryData;
use App\Http\Requests\Processes\RunPageRequest;
use App\Resolvers\Support\RunOutcomeSummaries;
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

        return RunOutcomePageData::from([
            'runId' => $runId,
            'summary' => $this->summaries->summaryOf($runId)
                ->map(fn (RunOutcomeSummaryData $summary) => $summary)
                ->getOrElse(Optional::create()),
        ]);
    }
}
