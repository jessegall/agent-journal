<?php

declare(strict_types=1);

namespace App\Support;

/**
 * How a question's notification is named: the target key its links are read under, and the key of the one occurrence
 * a question issues, so a replay finds it.
 */
final readonly class QuestionNotificationKeys
{
    public const string TARGET = 'core.question';

    public static function occurrenceKey(string $questionId): string
    {
        return "question:{$questionId}";
    }
}
