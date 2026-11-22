<?php

declare(strict_types=1);

namespace App\Processes\Resolvers;

use App\Communication\Contracts\NotificationTargetResolver;
use App\Communication\Data\NotificationLink;
use App\Processes\Data\RunOutcomeSummaryData;
use App\Processes\Resolvers\Support\RunOutcomeSummaries;
use App\Ui\Contracts\DeclaredPages;
use PhpOption\Option;

/**
 * A run outcome notification leads to the run's outcome-only page while the reader may hear of the run: its
 * responsible actor, the user its request entitled, or a reader the actor-and-project policy lets read it. Its
 * title is the attempt's current result, so a corrected result shows on the same receipt.
 */
final readonly class RunNotificationTarget implements NotificationTargetResolver
{
    public const string KEY = 'run';

    private const string OUTCOME_PAGE = 'processes.run-outcome';

    public function __construct(
        private RunOutcomeSummaries $summaries,
        private DeclaredPages $pages,
    ) {}

    /**
     * @return Option<NotificationLink>
     */
    public function linkFor(string $targetId): Option
    {
        return $this->summaries->summaryOf($targetId)->map(fn (RunOutcomeSummaryData $summary) => new NotificationLink(
            $summary->label,
            $this->pages->addressOf(self::OUTCOME_PAGE, ['run' => $summary->runId]),
        ));
    }

    public function disclosesMissing(): bool
    {
        return false;
    }
}
