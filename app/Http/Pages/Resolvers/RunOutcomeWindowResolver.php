<?php

declare(strict_types=1);

namespace App\Http\Pages\Resolvers;

use App\Http\Requests\Processes\RunPageRequest;
use App\Navigation\Contracts\PageResolver;
use App\Processes\Data\RunOutcomePageData;
use App\Processes\Data\RunOutcomeSummaryData;
use App\Processes\Resolvers\Support\RunOutcomeSummaries;
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
