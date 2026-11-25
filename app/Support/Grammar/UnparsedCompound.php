<?php

declare(strict_types=1);

namespace App\Support\Grammar;

use App\Enums\CommandRules\NodeType;
use App\Enums\CommandRules\TokenType;
use App\Support\Grammar\Concerns\UsesGrammarContext;
use App\Support\Syntax\TokenCursor;

/**
 * A subshell or group to read: its list up to the closing token, then its trailing redirects.
 */
final readonly class UnparsedCompound
{
    use UsesGrammarContext;

    private function __construct(
        public GrammarContext $context,
        public int $depth,
        public NodeType $type,
        public TokenType $closing,
    ) {}

    /**
     * The subshell, opened by (, or the group, opened by {, at the cursor.
     */
    public static function openingAt(GrammarContext $context, int $depth): self
    {
        if ($context->cursor->is(TokenType::OpenParen)) {
            return new self($context, $depth, NodeType::Subshell, TokenType::CloseParen);
        }

        return new self($context, $depth, NodeType::Group, TokenType::CloseBrace);
    }

    public static function opensAt(TokenCursor $cursor): bool
    {
        return $cursor->is(TokenType::OpenParen) || $cursor->is(TokenType::OpenBrace);
    }

    /**
     * The list inside, one level deeper, read into the compound node.
     */
    public function list(int $compound): UnparsedList
    {
        return new UnparsedList($this->context, $compound, $this->depth + 1, $this->closing);
    }

    public function redirect(int $compound): UnparsedRedirect
    {
        return new UnparsedRedirect($this->context, $compound, $this->depth);
    }

    public function name(): string
    {
        if ($this->type === NodeType::Subshell) {
            return 'subshell';
        }

        return 'group';
    }
}
