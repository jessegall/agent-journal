<?php

declare(strict_types=1);

namespace Domain\Questions\Support;

use Domain\Questions\Contracts\QuestionSummaryReader as QuestionSummaryReaderContract;
use Domain\Questions\Models\Question;

/**
 * Reads question rows as summaries.
 */
final readonly class QuestionSummaryReader implements QuestionSummaryReaderContract
{
    public function byIds(array $ids): array
    {
        return array_map(fn (Question $question) => $question->summary, $this->questionsOf($ids));
    }

    public function shownByIds(array $ids): array
    {
        return array_map(fn (Question $question) => $question->shown, $this->questionsOf($ids));
    }

    /**
     * @param  list<string>  $ids
     * @return list<Question>
     */
    private function questionsOf(array $ids): array
    {
        return array_values(Question::query()->whereKey($ids)->limit(count($ids))->get()->all());
    }
}
