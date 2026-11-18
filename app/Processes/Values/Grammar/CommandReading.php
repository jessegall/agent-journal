<?php

declare(strict_types=1);

namespace App\Processes\Values\Grammar;

use App\Processes\Values\Grammar\Concerns\UsesGrammarContext;
use App\Processes\Values\Word;

/**
 * A command to read at the cursor.
 */
final readonly class CommandReading
{
    use UsesGrammarContext;

    public function __construct(
        public GrammarContext $context,
        public int $depth,
    ) {}

    /**
     * The subshell or group that opens at the cursor.
     */
    public function compound(): CompoundReading
    {
        return CompoundReading::openingAt($this->context, $this->depth);
    }

    public function redirect(int $owner): RedirectReading
    {
        return new RedirectReading($this->context, $owner, $this->depth);
    }

    public function word(Word $word, int $command, bool $isBeforeArguments): WordReading
    {
        return WordReading::of($this->context, $word, $command, $this->depth, $isBeforeArguments);
    }
}
