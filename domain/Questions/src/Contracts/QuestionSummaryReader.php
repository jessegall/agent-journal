<?php

declare(strict_types=1);

namespace Domain\Questions\Contracts;

use Domain\Questions\Values\QuestionSummary;

/**
 * Reads questions as summaries for the domains that show them, without handing out the question rows.
 */
interface QuestionSummaryReader
{
    /**
     * The summaries of the questions with these ids that exist.
     *
     * @param  list<string>  $ids
     * @return list<QuestionSummary>
     */
    public function byIds(array $ids): array;
}
