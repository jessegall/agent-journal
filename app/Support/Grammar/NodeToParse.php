<?php

declare(strict_types=1);

namespace App\Support\Grammar;

use App\Support\Grammar\Concerns\UsesGrammarContext;

/**
 * A grammar rule to read at the cursor: an and-or chain or a pipeline.
 */
final readonly class NodeToParse
{
    use UsesGrammarContext;

    public function __construct(
        public GrammarContext $context,
        public int $depth,
    ) {}

    public function command(): CommandToParse
    {
        return new CommandToParse($this->context, $this->depth);
    }
}
