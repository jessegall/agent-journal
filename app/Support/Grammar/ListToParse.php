<?php

declare(strict_types=1);

namespace App\Support\Grammar;

use App\Enums\TokenType;
use App\Support\Grammar\Concerns\UsesGrammarContext;

/**
 * A list to read into a parent node: and-or chains split by ; & and newlines, up to a closing token or the end.
 */
final readonly class ListToParse
{
    use UsesGrammarContext;

    public function __construct(
        public GrammarContext $context,
        public int $parent,
        public int $depth,
        public TokenType|null $closing,
    ) {}

    public function andOr(): NodeToParse
    {
        return new NodeToParse($this->context, $this->depth);
    }

    /**
     * Whether the cursor stands where the list ends: the end, its closing token, or a ) or } that closes an outer list.
     */
    public function isAtItsEnd(): bool
    {
        $cursor = $this->context->cursor;

        return $cursor->atEnd()
            || ($this->closing !== null && $cursor->is($this->closing))
            || $cursor->is(TokenType::CloseParen)
            || $cursor->is(TokenType::CloseBrace);
    }
}
