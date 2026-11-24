<?php

declare(strict_types=1);

namespace Domain\Documents\Console\Concerns;

use App\Values\CommandReport;
use Domain\Documents\Data\PublicationCard;

/**
 * Reports one page of a document or report list: a line per record, where a search found it, and how to read on.
 */
trait ReportsRecordCards
{
    /**
     * @param  list<PublicationCard>  $cards
     */
    protected function cardsReport(string $alias, array $cards, string|null $next): CommandReport
    {
        $report = CommandReport::ending(self::SUCCESS);

        foreach ($cards as $card) {
            $report = $report->line("{$alias} {$card->number}  {$card->title}: {$card->abstract}");

            if (is_string($card->snippet) && is_string($card->foundIn)) {
                $report = $report->line("  {$card->foundIn}: {$card->snippet}");
            }
        }

        if ($next === null) {
            return $report;
        }

        return $report->line("More with --after {$next}.");
    }
}
