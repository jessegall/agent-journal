<?php

declare(strict_types=1);

namespace App\Processes\Grammar;

use App\CommandRules\Enums\TokenType;
use App\Processes\Grammar\Concerns\UsesGrammarContext;

/**
 * A list to read into a parent node: and-or chains split by ; & and newlines, up to a closing token or the end.
 */
final readonly class UnparsedList
{
    use UsesGrammarContext;

    public function __construct(
        public GrammarContext $context,
        public int $parent,
        public int $depth,
        public TokenType|null $closing,
    ) {}

    public function andOr(): UnparsedNode
    {
        return new UnparsedNode($this->context, $this->depth);
    }

    /**
     * Whether the cursor stands where the list ends: the end, its closing token, or a ) or } that closes an outer list.
     */
    public function isAtItsEnd(): bool
    {
        $cursor = $this->context->cursor;

        return $cursor->isAtEnd()
            || ($this->closing !== null && $cursor->is($this->closing))
            || $cursor->is(TokenType::CloseParen)
            || $cursor->is(TokenType::CloseBrace);
    }
}
