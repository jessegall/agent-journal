<?php

declare(strict_types=1);

namespace App\Processes\Data;

use Spatie\LaravelData\Data;

/**
 * One part of a run as a snapshot shows it: the four observations kept apart (lifecycle with its own end, capture,
 * the reader's live reading, the assessment and its receipt), with its activity.
 */
final class PartSnapshotData extends Data
{
    /**
     * @param  array<string, int>  $bytes
     * @param  list<string>  $problems
     */
    public function __construct(
        public readonly string $id,
        public readonly string $operation,
        public readonly string $lifecycle,
        public readonly string $end,
        public readonly string $capture,
        public readonly int $elapsedSeconds,
        public readonly array $bytes,
        public readonly string $latestLine,
        public readonly string $readerRevisionId,
        public readonly string $reading,
        public readonly string $assessmentId,
        public readonly string $outcome,
        public readonly array $problems,
        public readonly string $receiptId,
    ) {}
}
