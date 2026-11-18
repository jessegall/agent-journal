<?php

declare(strict_types=1);

namespace App\Processes\Syntax\CommandReaders;

use App\Processes\Contracts\CommandReader;
use App\Processes\Enums\TokenType;
use App\Processes\Stages\Grammar\CommandReading;
use App\Processes\Syntax\TokenCursor;
use App\Processes\Syntax\UnsupportedConstructs;

/**
 * name=( ... ) is not supported: read past it as one Unsupported node.
 */
final readonly class ArrayAssignmentReader implements CommandReader
{
    public function __construct(private UnsupportedConstructs $unsupported) {}

    public function reads(TokenCursor $cursor): bool
    {
        return $cursor->is(TokenType::Word)
            && $cursor->peekIs(1, TokenType::OpenParen)
            && $cursor->word('A word is missing.')->isArrayName();
    }

    public function read(CommandReading $reading): int
    {
        return $this->unsupported->skip($reading->context, 'An array assignment is not supported.', null);
    }
}
