<?php

declare(strict_types=1);

namespace App\Values;

use App\Agents\Values\CommandPart;
use App\CommandRules\Enums\ParseOutcome;
use App\Processes\Enums\ShellDialect;

/**
 * A shell line as the Processes parser read it: the source, its dialect, how far the parse got, and its parts.
 */
final readonly class ShellCommand
{
    /**
     * @param  list<CommandPart>  $parts  each simple command of the line, in order
     */
    public function __construct(
        public string $source,
        public ShellDialect $dialect,
        public ParseOutcome $outcome,
        public array $parts,
    ) {}

    /**
     * Whether running the line changes files, or could: a line the parser could not read fully counts as one that
     * does. It says what the line does, not what anyone is allowed to do.
     */
    public function changesFiles(): bool
    {
        if (! $this->outcome->isComplete()) {
            return true;
        }

        foreach ($this->parts as $part) {
            if ($part->effect->changesFiles()) {
                return true;
            }
        }

        return false;
    }

    /**
     * Whether running the line only reads: the parser read it whole and no part of it changes files or could.
     */
    public function readsOnly(): bool
    {
        return ! $this->changesFiles();
    }
}
