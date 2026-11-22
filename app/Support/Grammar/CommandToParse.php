<?php

declare(strict_types=1);

namespace App\Support\Grammar;

use App\Support\Grammar\Concerns\UsesGrammarContext;
use App\Values\Word;

/**
 * A command to read at the cursor.
 */
final readonly class CommandToParse
{
    use UsesGrammarContext;

    public function __construct(
        public GrammarContext $context,
        public int $depth,
    ) {}

    /**
     * The subshell or group that opens at the cursor.
     */
    public function compound(): CompoundToParse
    {
        return CompoundToParse::openingAt($this->context, $this->depth);
    }

    public function redirect(int $owner): RedirectToParse
    {
        return new RedirectToParse($this->context, $owner, $this->depth);
    }

    public function word(Word $word, int $command, bool $isBeforeArguments): WordToParse
    {
        return WordToParse::of($this->context, $word, $command, $this->depth, $isBeforeArguments);
    }
}
