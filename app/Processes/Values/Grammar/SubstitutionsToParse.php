<?php

declare(strict_types=1);

namespace App\Processes\Values\Grammar;

use App\Processes\Values\Grammar\Concerns\UsesGrammarContext;
use App\Processes\Values\Lines\ShellSource;
use App\Processes\Values\Word;

/**
 * A word whose command and process substitutions are read as children of an owner node.
 */
final readonly class SubstitutionsToParse
{
    use UsesGrammarContext;

    public function __construct(
        public GrammarContext $context,
        public Word $word,
        public int $owner,
        public int $depth,
    ) {}

    /**
     * A word found inside this one, such as in ${...}, read one level deeper for the same owner.
     */
    public function inside(Word $word): self
    {
        return new self($this->context, $word, $this->owner, $this->depth + 1);
    }

    /**
     * The text of a substitution as a source of its own, one level deeper, read into the substitution node.
     */
    public function innerSource(string $text, int $offset, int $substitution): ShellSource
    {
        return $this->context->source->inner($text, $offset, $this->depth + 1, $substitution);
    }
}
