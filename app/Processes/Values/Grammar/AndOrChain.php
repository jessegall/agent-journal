<?php

declare(strict_types=1);

namespace App\Processes\Values\Grammar;

use App\Processes\Enums\NodeType;
use App\Processes\Enums\TokenType;

/**
 * An and-or chain part-way through: the node of what was read so far.
 */
final readonly class AndOrChain
{
    public function __construct(public NodeReading $reading, public int $node) {}

    public function isAtAndOr(): bool
    {
        $cursor = $this->reading->cursor();

        return $cursor->is(TokenType::AndIf) || $cursor->is(TokenType::OrIf);
    }

    public function linkedBy(NodeType $type): AndOrLink
    {
        return new AndOrLink($this, $type);
    }
}
