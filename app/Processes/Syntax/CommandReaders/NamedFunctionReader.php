<?php

declare(strict_types=1);

namespace App\Processes\Syntax\CommandReaders;

use App\Processes\Contracts\CommandReader;
use App\Processes\Enums\TokenType;
use App\Processes\Stages\Grammar\CommandReading;
use App\Processes\Syntax\FunctionDefinitions;
use App\Processes\Syntax\TokenCursor;

/**
 * name () body: read as one unsupported definition whose body must still be complete.
 */
final readonly class NamedFunctionReader implements CommandReader
{
    public function __construct(private FunctionDefinitions $functions) {}

    public function reads(TokenCursor $cursor): bool
    {
        return $cursor->is(TokenType::Word)
            && $cursor->peekIs(1, TokenType::OpenParen)
            && $cursor->peekIs(2, TokenType::CloseParen);
    }

    public function read(CommandReading $reading): int
    {
        return $this->functions->read($reading, 3);
    }
}
