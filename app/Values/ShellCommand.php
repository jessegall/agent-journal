<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\ParseOutcome;
use App\Enums\ShellDialect;

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
}
