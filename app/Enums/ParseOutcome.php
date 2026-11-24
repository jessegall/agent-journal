<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * How far the parser read a shell line: fully, up to a dynamic expansion it cannot resolve, or not at all.
 */
enum ParseOutcome: string
{
    case Complete = 'complete';
    case Invalid = 'invalid';
    case Unsupported = 'unsupported';
    case LimitExceeded = 'limit_exceeded';

    /**
     * A line with a word that is only known when it runs, such as a variable or a command substitution.
     */
    case DynamicExpansion = 'dynamic_expansion';
    case Unparsed = 'unparsed';

    /**
     * Whether the line could not be read at all: invalid, or past a limit.
     */
    public function isUnreadable(): bool
    {
        return $this === self::Invalid || $this === self::LimitExceeded;
    }

    public function isComplete(): bool
    {
        return $this === self::Complete;
    }
}
