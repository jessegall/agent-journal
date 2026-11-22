<?php

declare(strict_types=1);

namespace App\Support\Run;

/**
 * The environment an admitted line's child inherits: this process's own, without the start's secrets.
 */
final readonly class ChildEnvironment
{
    private const array SECRET_VARIABLES = ['JOURNAL_START_TOKEN', 'JOURNAL_EVENT_KEY'];

    /**
     * @return array<string, string>
     */
    public static function ofThisProcess(): array
    {
        return array_diff_key(getenv(), array_flip(self::SECRET_VARIABLES));
    }
}
