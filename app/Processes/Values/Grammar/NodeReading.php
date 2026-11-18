<?php

declare(strict_types=1);

namespace App\Processes\Values\Grammar;

use App\Processes\Values\Grammar\Concerns\UsesGrammarContext;

/**
 * A grammar rule to read at the cursor: an and-or chain or a pipeline.
 */
final readonly class NodeReading
{
    use UsesGrammarContext;

    public function __construct(
        public GrammarContext $context,
        public int $depth,
    ) {}

    public function command(): CommandReading
    {
        return new CommandReading($this->context, $this->depth);
    }
}
