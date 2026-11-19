<?php

declare(strict_types=1);

namespace App\Processes\Syntax\CommandReaders;

use App\Processes\Enums\TokenType;
use App\Processes\Syntax\TokenCursor;

/**
 * name=( ... ): an array assignment is not supported.
 */
final readonly class ArrayAssignmentReader extends UnsupportedCommandReader
{
    public static function reads(TokenCursor $cursor): bool
    {
        return $cursor->is(TokenType::Word)
            && $cursor->peekIs(1, TokenType::OpenParen)
            && $cursor->word('A word is missing.')->isArrayName();
    }

    protected function reason(): string
    {
        return 'An array assignment is not supported.';
    }
}
