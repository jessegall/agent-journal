<?php

declare(strict_types=1);

namespace App\Processes\Values\Grammar;

use App\Processes\Enums\TokenType;
use App\Processes\Exceptions\ShellGrammarStopped;

/**
 * A function definition with its header stepped past and its body at the cursor; the definition becomes one
 * Unsupported node from where it started.
 */
final readonly class FunctionToParse
{
    private function __construct(public CommandToParse $toParse, public int $start) {}

    /**
     * @param  int  $tokens  how many tokens come before the body: the name, (), and the function keyword
     *
     * @throws ShellGrammarStopped
     */
    public static function afterHeader(CommandToParse $command, int $tokens): self
    {
        $cursor = $command->cursor();
        $start = $cursor->position();
        for ($skipped = 0; $skipped < $tokens; $skipped++) {
            $cursor->advance();
        }
        $cursor->skip(TokenType::Newline);
        if (! CompoundToParse::opensAt($cursor)) {
            throw ShellGrammarStopped::invalid('A function definition has no body.', $start);
        }

        return new self($command, $start);
    }
}
