<?php

declare(strict_types=1);

namespace App\Pipes\Grammar;

use App\Contracts\Pipe;
use App\Enums\TokenType;
use App\Exceptions\ShellGrammarStopped;
use App\Support\Grammar\CommandToParse;
use App\Support\Grammar\FunctionToParse;

/**
 * Steps past function name, or function name (), before a function body; arguments after the name make the line
 * invalid.
 */
final readonly class SkipKeywordFunctionHeader implements Pipe
{
    /**
     * @throws ShellGrammarStopped
     */
    public function handle(CommandToParse $toParse): FunctionToParse
    {
        $cursor = $toParse->cursor();
        $hasParentheses = $cursor->peekIs(2, TokenType::OpenParen);

        if ($hasParentheses && ! $cursor->peekIs(3, TokenType::CloseParen)) {
            throw ShellGrammarStopped::invalid('A function name is followed by arguments.', $cursor->position());
        }

        return FunctionToParse::afterHeader($toParse, $hasParentheses ? 4 : 2);
    }
}
