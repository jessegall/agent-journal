<?php

declare(strict_types=1);

namespace App\Api\Processes;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * A run's output summary: its mode and lifecycle and every part with its result.
 */
final class OutputSummary extends Data
{
    /**
     * @param  list<PartSummary>  $parts
     */
    public function __construct(
        public readonly string $label,
        public readonly string $mode,
        public readonly string $lifecycle,
        #[DataCollectionOf(PartSummary::class)]
        public readonly array $parts,
    ) {}
}
