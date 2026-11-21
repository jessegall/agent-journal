<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\QuestionReminders\States;

use App\Hooks\Contracts\WorkOccurrenceGuard;
use App\Hooks\References\Exceptions\WorkOccurrenceStale;
use App\Hooks\References\WorkOccurrence;
use Tests\Fixtures\Domains\QuestionReminders\Models\Question;

/**
 * A reminder's work is live while its question still waits for an answer, checked under the question's row lock.
 */
final class AwaitingAnswerGuard implements WorkOccurrenceGuard
{
    public function lockAndRequireLive(WorkOccurrence $occurrence): void
    {
        $question = Question::query()->whereKey($occurrence->subjectId)->lockForUpdate()->first();

        if ($question === null || ! $question->isWaiting()) {
            throw WorkOccurrenceStale::for($occurrence);
        }
    }
}
