<?php

declare(strict_types=1);

namespace Domain\Tasks\Support;

use Domain\Tasks\Exceptions\TaskTextTooLong;

/**
 * How long a task's texts may be, in Unicode characters, the same for every way a task is written.
 */
final class TaskLimits
{
    public const int TITLE_CHARACTERS = 240;

    public const int NOTE_CHARACTERS = 8000;

    /**
     * @throws TaskTextTooLong
     */
    public static function check(string $title, string $brief): void
    {
        self::refuseLonger('title', $title, self::TITLE_CHARACTERS);
        self::refuseLonger('brief', $brief, self::NOTE_CHARACTERS);
    }

    /**
     * A result note, block reason or cancel reason.
     *
     * @throws TaskTextTooLong
     */
    public static function checkNote(string $note): void
    {
        self::refuseLonger('note', $note, self::NOTE_CHARACTERS);
    }

    private static function refuseLonger(string $field, string $text, int $limit): void
    {
        if (mb_strlen($text) > $limit) {
            throw TaskTextTooLong::for($field, $limit);
        }
    }
}
