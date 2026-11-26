<?php

declare(strict_types=1);

namespace App\Processes\Grammar;

use App\CommandRules\Enums\TokenType;
use App\Exceptions\ShellGrammarStopped;
use App\Values\AgentText;

/**
 * A function definition with its header stepped past and its body at the cursor; the definition becomes one
 * Unsupported node from where it started.
 */
final readonly class UnparsedFunction
{
    private function __construct(public UnparsedCommand $toParse, public int $start) {}

    /**
     * @param  int  $tokens  how many tokens come before the body: the name, (), and the function keyword
     *
     * @throws ShellGrammarStopped
     */
    public static function afterHeader(UnparsedCommand $command, int $tokens): self
    {
        $cursor = $command->cursor();
        $start = $cursor->position();

        for ($skipped = 0; $skipped < $tokens; $skipped++) {
            $cursor->advance();
        }

        $cursor->skip(TokenType::Newline);

        if (! UnparsedCompound::opensAt($cursor)) {
            throw ShellGrammarStopped::invalid(AgentText::of('core.shell.function_without_body'), $start);
        }

        return new self($command, $start);
    }
}
