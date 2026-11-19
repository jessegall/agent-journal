<?php

declare(strict_types=1);

namespace App\Processes\Values\Grammar;

use App\Processes\Values\Grammar\Concerns\UsesGrammarContext;
use App\Processes\Values\SourceRange;
use App\Processes\Values\Word;

/**
 * A redirect operator at the cursor, with the node that owns it.
 */
final readonly class RedirectToParse
{
    use UsesGrammarContext;

    public function __construct(
        public GrammarContext $context,
        public int $owner,
        public int $depth,
    ) {}

    public function substitutions(Word $word, int $owner): SubstitutionsToParse
    {
        return new SubstitutionsToParse($this->context, $word, $owner, $this->depth);
    }

    /**
     * No word to read substitutions from: a close has no target, and a quoted here-document body is only text.
     */
    public function nothingToRead(SourceRange $range): SubstitutionsToParse
    {
        return $this->substitutions(new Word([], $range), $this->owner);
    }
}
