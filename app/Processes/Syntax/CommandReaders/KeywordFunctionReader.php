<?php

declare(strict_types=1);

namespace App\Processes\Syntax\CommandReaders;

use App\Processes\Contracts\CommandReader;
use App\Processes\Enums\TokenType;
use App\Processes\Exceptions\ShellGrammarStopped;
use App\Processes\Stages\Grammar\CommandReading;
use App\Processes\Syntax\FunctionDefinitions;
use App\Processes\Syntax\TokenCursor;

/**
 * function name [()] body: read as one unsupported definition whose body must still be complete.
 */
final readonly class KeywordFunctionReader implements CommandReader
{
    public function __construct(private FunctionDefinitions $functions) {}

    public function reads(TokenCursor $cursor): bool
    {
        return $cursor->currentLiteral() === 'function' && $cursor->peekIs(1, TokenType::Word);
    }

    public function read(CommandReading $reading): int
    {
        $cursor = $reading->cursor();
        $hasParentheses = $cursor->peekIs(2, TokenType::OpenParen);
        if ($hasParentheses && ! $cursor->peekIs(3, TokenType::CloseParen)) {
            throw ShellGrammarStopped::invalid('A function name is followed by arguments.', $cursor->position());
        }

        return $this->functions->read($reading, $hasParentheses ? 4 : 2);
    }
}
