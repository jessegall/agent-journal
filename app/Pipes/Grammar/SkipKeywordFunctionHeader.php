<?php

declare(strict_types=1);

namespace App\Pipes\Grammar;

use App\Contracts\Bus\Pipe;
use App\Enums\CommandRules\TokenType;
use App\Exceptions\ShellGrammarStopped;
use App\Support\Grammar\UnparsedCommand;
use App\Support\Grammar\UnparsedFunction;
use App\Values\AgentText;

/**
 * Steps past function name, or function name (), before a function body; arguments after the name make the line
 * invalid.
 */
final readonly class SkipKeywordFunctionHeader implements Pipe
{
    /**
     * @throws ShellGrammarStopped
     */
    public function handle(UnparsedCommand $toParse): UnparsedFunction
    {
        $cursor = $toParse->cursor();
        $hasParentheses = $cursor->isNext(2, TokenType::OpenParen);
        $closesAtOnce = $cursor->isNext(3, TokenType::CloseParen);

        if ($hasParentheses && ! $closesAtOnce) {
            throw ShellGrammarStopped::invalid(AgentText::of('core.shell.function_arguments'), $cursor->position());
        }

        return UnparsedFunction::afterHeader($toParse, $hasParentheses ? 4 : 2);
    }
}
