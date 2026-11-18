<?php

declare(strict_types=1);

namespace App\Reads\Values;

/**
 * One measured operation: its label, what it read, and the value the work returned.
 *
 * @template TValue
 */
final readonly class Measurement
{
    /**
     * @param  TValue  $value
     */
    public function __construct(
        public string $label,
        public ReadCounts $counts,
        public mixed $value,
    ) {}
}
