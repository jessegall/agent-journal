<?php

declare(strict_types=1);

namespace App\Support\Inputs\Values;

/**
 * A stop as its driver reports it: the turn that stops, whether the agent already went on once after a refused stop,
 * and the words the agent closed the turn with, which only its terminal shows.
 */
final readonly class StopDetails
{
    public function __construct(
        public string $turnId,
        public bool $isAfterRefusedStop,
        public string $closingWords,
    ) {}

    public function hasClosingWords(): bool
    {
        return $this->closingWords !== '';
    }
}
