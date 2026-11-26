<?php

declare(strict_types=1);

namespace App\Processes\Grammar;

use App\CommandRules\Enums\NodeType;
use App\CommandRules\Enums\TokenType;

/**
 * An and-or chain part-way through: the node of what was read so far.
 */
final readonly class AndOrChain
{
    public function __construct(public UnparsedNode $toParse, public int $node) {}

    public function isAtAndOr(): bool
    {
        $cursor = $this->toParse->cursor();

        return $cursor->is(TokenType::AndIf) || $cursor->is(TokenType::OrIf);
    }

    public function linkedBy(NodeType $type): AndOrLink
    {
        return new AndOrLink($this, $type);
    }
}
