<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Concerns\LinksTargetsOneByOne;
use App\Contracts\Chat\NotificationTargetResolver;
use App\Contracts\Navigation\DeclaredPages;
use App\Data\NotificationLink;
use App\Data\RunOutcomeSummaryData;
use App\Resolvers\Support\RunOutcomeSummaries;
use PhpOption\Option;

/**
 * A run outcome notification leads to the run's outcome-only page while the reader may hear of the run: its
 * responsible actor, the user its request entitled, or a reader the actor-and-project policy lets read it. Its
 * title is the attempt's current result, so a corrected result shows on the same receipt.
 */
final readonly class RunNotificationTarget implements NotificationTargetResolver
{
    use LinksTargetsOneByOne;

    public const string KEY = 'run';

    private const string OUTCOME_PAGE = 'processes.run-outcome';

    public function __construct(
        private RunOutcomeSummaries $summaries,
        private DeclaredPages $pages,
    ) {}

    /**
     * @return Option<NotificationLink>
     */
    private function linkFor(string $targetId): Option
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
