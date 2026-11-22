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
     * The old parser's outcome for a line whose expansion it could not follow; it stays until the cutover to the tree.
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
