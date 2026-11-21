<?php

declare(strict_types=1);

namespace App\Hooks\Contracts;

/**
 * A state that tells the agent what to do while it is the foreground work: its instruction type, which with the
 * frame's own subject is the descriptor a marker holds, and the instruction's text, read fresh for this hook. A state
 * without it is passive and instructs nothing.
 */
interface InstructsForeground
{
    public function instructionType(): string;

    public function instructionText(): string;
}
