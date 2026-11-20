<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Enums\TokenType;
use App\Processes\Exceptions\ShellGrammarStopped;
use App\Processes\Values\Grammar\CommandToParse;
use App\Processes\Values\Grammar\FunctionToParse;

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
