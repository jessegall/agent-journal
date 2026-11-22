<?php

declare(strict_types=1);

namespace App\Values;

/**
 * How many of a publication's files are staged.
 */
final readonly class PreparationProgress
{
    public function __construct(
        public int $staged,
        public int $total,
    ) {}

    public function isComplete(): bool
    {
        return $this->staged >= $this->total;
    }
}
