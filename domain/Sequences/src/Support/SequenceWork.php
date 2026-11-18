<?php

declare(strict_types=1);

namespace Domain\Sequences\Support;

use Domain\Sequences\Enums\SequenceRunState;

/**
 * A fresh snapshot of one sequence run and its current step, read for one hook and never kept across hooks.
 */
final readonly class SequenceWork
{
    public function __construct(
        public int $runNumber,
        public int $stepNumber,
        public string $stepInstruction,
        public SequenceRunState $state,
    ) {}

    public function needsWork(): bool
    {
        return $this->state->needsWork();
    }

    public function currentInstruction(): string
    {
        return "Sequence run {$this->runNumber} is on step {$this->stepNumber}: {$this->stepInstruction}";
    }
}
