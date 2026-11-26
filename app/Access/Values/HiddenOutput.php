<?php

declare(strict_types=1);

namespace App\Access\Values;

use App\Access\Mcp\Tools\OutputsReadTool;

/**
 * One way a command line would hide output a check or build must keep: the part it hides, what is lost, the operator
 * that hides it, and the command line without it.
 */
final readonly class HiddenOutput
{
    public function __construct(
        public int $node,
        public string $lost,
        public string $operator,
        public string $correction,
    ) {}

    public function reason(): string
    {
        return sprintf(
            '%s hides the %s of a part whose full output is needed: run %s and read its stored output afterwards with '
            .'the %s tool.',
            $this->operator,
            $this->lost,
            $this->correction,
            OutputsReadTool::NAME,
        );
    }
}
