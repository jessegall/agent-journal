<?php

declare(strict_types=1);

namespace Domain\Questions\Support;

use Domain\Questions\Contracts\QuestionSummaryReader;
use Domain\Questions\Models\Question;

/**
 * Reads question rows as summaries.
 */
final readonly class QuestionSummaries implements QuestionSummaryReader
{
    public function byIds(array $ids): array
    {
        $questions = Question::query()->whereKey($ids)->limit(count($ids))->get()->all();

        return array_map(fn (Question $question) => $question->summary(), array_values($questions));
    }
}
