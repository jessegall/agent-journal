<?php

declare(strict_types=1);

namespace App\Processes\Calls;

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
        public int $node,
        public int $attempt,
        public string $operation,
        public string $lifecycle,
        public string $end,
        public int|null $code,
        public string $capture,
        public array $bytes,
        public array $partSummary,
    ) {}
}
