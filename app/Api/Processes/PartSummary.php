<?php

declare(strict_types=1);

namespace App\Api\Processes;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;

/**
 * One part of a run as its output summary shows it: where it is, how it ended, what it captured and its result.
 */
final class PartSummary extends Data
{
    /**
     * @param  array<string, int>  $bytes
     * @param  array{type: string, outcome: string, receipt_id: string, problems: list<string>}  $partSummary
     */
    public function __construct(
        public readonly int $node,
        public readonly int $attempt,
        public readonly string $operation,
        public readonly string $lifecycle,
        public readonly string $end,
        public readonly int|null $code,
        public readonly string $capture,
        public readonly array $bytes,
        #[MapName('result')]
        public readonly array $partSummary,
    ) {}
}
