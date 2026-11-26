<?php

declare(strict_types=1);

namespace App\Processes\Grammar;

use App\Processes\Grammar\Concerns\UsesGrammarContext;
use App\Values\Word;

/**
 * A command to read at the cursor.
 */
final readonly class UnparsedCommand
{
    use UsesGrammarContext;

    public function __construct(
        public GrammarContext $context,
        public int $depth,
    ) {}

    /**
     * The subshell or group that opens at the cursor.
     */
    public function compound(): UnparsedCompound
    {
        return UnparsedCompound::openingAt($this->context, $this->depth);
    }

    public function redirect(int $owner): UnparsedRedirect
    {
        return new UnparsedRedirect($this->context, $owner, $this->depth);
    }

    public function word(Word $word, int $command, bool $isBeforeArguments): UnparsedWord
    {
        return UnparsedWord::of($this->context, $word, $command, $this->depth, $isBeforeArguments);
    }
}
