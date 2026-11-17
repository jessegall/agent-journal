<?php

declare(strict_types=1);

namespace App\Core\Hooks\Inputs;

use App\Core\Hooks\Enums\ParseOutcome;
use App\Core\Hooks\Enums\ShellDialect;

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
     * Whether running the line may change files; a line the parser could not read fully counts as one that may.
     */
    public function mayChangeFiles(): bool
    {
        if (! $this->outcome->isComplete()) {
            return true;
        }

        foreach ($this->parts as $part) {
            if ($part->effect->mayChangeFiles()) {
                return true;
            }
        }

        return false;
    }

    /**
     * Whether the parser read the whole line, with nothing left it could not resolve.
     */
    public function isFullyRead(): bool
    {
        return $this->outcome->isComplete();
    }

    /**
     * Whether a part of the line is a test run or a build, or a command the parser could not name, run outside a saved command.
     */
    public function needsSavedCommand(): bool
    {
        foreach ($this->parts as $part) {
            if ($part->kind->needsSavedCommand()) {
                return true;
            }
        }

        return false;
    }
}
