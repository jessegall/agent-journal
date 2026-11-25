<?php

declare(strict_types=1);

namespace App\Support;

use App\Models\Questions\Question;

/**
 * How a question's notification is named: the target key its links are read under, and the key of the one occurrence
 * a question issues, so a replay finds it.
 */
final readonly class QuestionNotificationKeys
{
    /**
     * The target key a question's notification links are read under: the question's link type.
     */
    public static function target(): string
    {
        return Question::linkType();
    }

    public static function occurrenceKey(string $questionId): string
    {
        return "question:{$questionId}";
    }
}
