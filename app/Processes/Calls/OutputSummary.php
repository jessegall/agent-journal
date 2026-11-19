<?php

declare(strict_types=1);

namespace App\Processes\Calls;

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
        public string $label,
        public string $mode,
        public string $lifecycle,
        #[DataCollectionOf(PartSummary::class)]
        public array $parts,
    ) {}
}
