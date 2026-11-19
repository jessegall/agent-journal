<?php

declare(strict_types=1);

namespace App\Processes\Values\Grammar;

use App\Processes\Enums\TokenType;
use App\Processes\Values\Redirect;

/**
 * A simple command part-way through: its parts so far, and whether a word turned it into an array assignment.
 */
final readonly class SimpleCommandBeingRead
{
    public function __construct(
        public CommandReading $reading,
        public SimpleCommandParts $parts,
        public bool $isArrayAssignment,
    ) {}

    /**
     * Whether the token at the cursor still belongs to the command: a redirect or a word, and a } only after the first
     * argument.
     */
    public function continues(): bool
    {
        $cursor = $this->reading->cursor();
        if ($this->isArrayAssignment || $cursor->atEnd()) {
            return false;
        }

        return $cursor->is(TokenType::Redirect)
            || $cursor->is(TokenType::Word)
            || $cursor->is(TokenType::OpenBrace)
            || ($cursor->is(TokenType::CloseBrace) && $this->parts->hasArguments());
    }

    public function isAtRedirect(): bool
    {
        return $this->reading->cursor()->is(TokenType::Redirect);
    }

    public function withRedirect(Redirect $redirect): self
    {
        return new self($this->reading, $this->parts->withRedirect($redirect), false);
    }

    public function withWord(WordReading $word): self
    {
        return new self($this->reading, $this->parts->withWord($word), false);
    }

    public function asArrayAssignment(): self
    {
        return new self($this->reading, $this->parts, true);
    }
}
