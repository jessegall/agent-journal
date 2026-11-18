<?php

declare(strict_types=1);

namespace App\Processes\Stages\Grammar;

use App\Processes\Stages\Grammar\Concerns\UsesGrammarContext;
use App\Processes\Values\Word;

/**
 * A redirect operator at the cursor, with the node that owns it.
 */
final readonly class RedirectReading
{
    use UsesGrammarContext;

    public function __construct(
        public GrammarContext $context,
        public int $owner,
        public int $depth,
    ) {}

    public function substitutions(Word $word, int $owner): SubstitutionsReading
    {
        return new SubstitutionsReading($this->context, $word, $owner, $this->depth);
    }
}
