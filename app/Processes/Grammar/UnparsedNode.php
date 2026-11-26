<?php

declare(strict_types=1);

namespace App\Processes\Grammar;

use App\Processes\Grammar\Concerns\UsesGrammarContext;

/**
 * A grammar rule to read at the cursor: an and-or chain or a pipeline.
 */
final readonly class UnparsedNode
{
    use UsesGrammarContext;

    public function __construct(
        public GrammarContext $context,
        public int $depth,
    ) {}

    public function command(): UnparsedCommand
    {
        return new UnparsedCommand($this->context, $this->depth);
    }
}
