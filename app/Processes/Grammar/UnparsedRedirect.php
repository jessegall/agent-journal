<?php

declare(strict_types=1);

namespace App\Processes\Grammar;

use App\Processes\Grammar\Concerns\UsesGrammarContext;
use App\Processes\Grammar\Values\SourceRange;
use App\Values\Word;

/**
 * A redirect operator at the cursor, with the node that owns it.
 */
final readonly class UnparsedRedirect
{
    use UsesGrammarContext;

    public function __construct(
        public GrammarContext $context,
        public int $owner,
        public int $depth,
    ) {}

    public function substitutions(Word $word, int $owner): UnparsedSubstitutions
    {
        return new UnparsedSubstitutions($this->context, $word, $owner, $this->depth);
    }

    /**
     * No word to read substitutions from: a close has no target, and a quoted here-document body is only text.
     */
    public function nothingToRead(SourceRange $range): UnparsedSubstitutions
    {
        return $this->substitutions(new Word([], $range), $this->owner);
    }
}
