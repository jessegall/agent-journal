<?php

declare(strict_types=1);

namespace App\Support\Grammar;

use App\Enums\TokenType;
use App\Values\Redirect;

/**
 * A simple command part-way through: its parts so far, and whether a word turned it into an array assignment.
 */
final readonly class SimpleCommandDraft
{
    public function __construct(
        public CommandToParse $toParse,
        public SimpleCommandParts $parts,
        public bool $isArrayAssignment,
    ) {}

    /**
     * Whether the token at the cursor still belongs to the command: a redirect or a word, and a } only after the first
     * argument.
     */
    public function continues(): bool
    {
        $cursor = $this->toParse->cursor();

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
        return $this->toParse->cursor()->is(TokenType::Redirect);
    }

    public function withRedirect(Redirect $redirect): self
    {
        return new self($this->toParse, $this->parts->withRedirect($redirect), false);
    }

    public function withWord(WordToParse $word): self
    {
        return new self($this->toParse, $this->parts->withWord($word), false);
    }

    public function asArrayAssignment(): self
    {
        return new self($this->toParse, $this->parts, true);
    }
}
