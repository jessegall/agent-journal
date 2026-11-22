<?php

declare(strict_types=1);

namespace App\Values;

/**
 * How far a check says it got: completed steps and the total, or no total, which keeps progress indeterminate.
 */
final readonly class ReadProgress
{
    public function __construct(
        public int $completed,
        public int|null $total,
    ) {}

    public static function none(): self
    {
        return new self(0, null);
    }

    public function isIndeterminate(): bool
    {
        return $this->total === null;
    }

    public function isPastItsTotal(): bool
    {
        return $this->total !== null && $this->completed > $this->total;
    }
}
