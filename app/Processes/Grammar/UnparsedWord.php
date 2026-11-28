<?php

declare(strict_types=1);

namespace App\Processes\Grammar;

use App\CommandRules\Enums\WordPlace;
use App\Processes\Grammar\Concerns\UsesGrammarContext;
use App\Values\Word;

/**
 * One word of a simple command, read in order: it may start an array assignment, name an assignment or be an argument.
 */
final readonly class UnparsedWord
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

    public function canContainSubstitution(): bool
    {
        if ($this->isArrayAssignment()) {
            return false;
        }

        foreach ($this->word->segments as $segment) {
            if ($segment->canContainSubstitution()) {
                return true;
            }
        }

        return false;
    }

    /**
     * The word whose substitutions are read as children of its command.
     */
    public function substitutions(): UnparsedSubstitutions
    {
        return new UnparsedSubstitutions($this->context, $this->word, $this->command, $this->depth);
    }
}
