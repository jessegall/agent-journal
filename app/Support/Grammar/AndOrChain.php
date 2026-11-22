<?php

declare(strict_types=1);

namespace App\Support\Grammar;

use App\Enums\NodeType;
use App\Enums\TokenType;

/**
 * An and-or chain part-way through: the node of what was read so far.
 */
final readonly class AndOrChain
{
    public function __construct(public NodeToParse $toParse, public int $node) {}

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
