<?php

declare(strict_types=1);

namespace App\Processes\Values\Grammar;

use App\Processes\Enums\WordPlace;
use App\Processes\Values\Grammar\Concerns\UsesGrammarContext;
use App\Processes\Values\Word;

/**
 * One word of a simple command, read in order: it may start an array assignment, name an assignment or be an argument.
 */
final readonly class WordToParse
{
    use UsesGrammarContext;

    /**
     * @param  bool  $isBeforeArguments  whether no argument came before it, so it may still be an assignment
     */
    private function __construct(
        public GrammarContext $context,
        public Word $word,
        public int $command,
        public int $depth,
        public bool $isBeforeArguments,
        public WordPlace $place,
    ) {}

    public static function of(
        GrammarContext $context,
        Word $word,
        int $command,
        int $depth,
        bool $isBeforeArguments,
    ): self {
        return new self($context, $word, $command, $depth, $isBeforeArguments, WordPlace::Unread);
    }

    public function placedAs(WordPlace $place): self
    {
        return clone ($this, ['place' => $place]);
    }

    public function end(): int
    {
        return $this->word->range->end;
    }

    public function isArrayAssignment(): bool
    {
        return $this->place === WordPlace::ArrayAssignment;
    }

    /**
     * The word's substitutions, read as children of its command; an array assignment's are not read.
     */
    public function substitutions(): SubstitutionsToParse
    {
        $word = $this->isArrayAssignment() ? new Word([], $this->word->range) : $this->word;

        return new SubstitutionsToParse($this->context, $word, $this->command, $this->depth);
    }
}
