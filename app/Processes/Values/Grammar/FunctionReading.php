<?php

declare(strict_types=1);

namespace App\Processes\Values\Grammar;

use App\Processes\Enums\TokenType;
use App\Processes\Exceptions\ShellGrammarStopped;

/**
 * A function definition with its header stepped past and its body at the cursor; the definition becomes one
 * Unsupported node from where it started.
 */
final readonly class FunctionReading
{
    private function __construct(public CommandReading $reading, public int $start) {}

    /**
     * @param  int  $headerTokens  how many tokens come before the body: the name, (), and the function keyword
     *
     * @throws ShellGrammarStopped
     */
    public static function afterHeader(CommandReading $reading, int $headerTokens): self
    {
        $cursor = $reading->cursor();
        $start = $cursor->position();
        for ($skipped = 0; $skipped < $headerTokens; $skipped++) {
            $cursor->advance();
        }
        $cursor->skip(TokenType::Newline);
        if (! CompoundReading::opensAt($cursor)) {
            throw ShellGrammarStopped::invalid('A function definition has no body.', $start);
        }

        return new self($reading, $start);
    }
}
