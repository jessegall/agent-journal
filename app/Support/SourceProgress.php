<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Bus\BatchOutcome;
use App\Values\BufferedHit;
use App\Values\SourcePosition;

/**
 * Where one source of a search stands: the position to ask it from next, whether its range is exhausted, the
 * certified hits it returned that are not shown yet, and how many calls in a row it timed out or stood still.
 */
final class SourceProgress
{
    /**
     * @param  list<BufferedHit>  $buffer
     */
    public function __construct(
        public readonly string $sourceKey,
        public SourcePosition|null $position = null,
        public bool $exhausted = false,
        public array $buffer = [],
        public int $stalls = 0,
        public bool $failed = false,
    ) {}

    /**
     * Whether the source must be asked again before the search may emit past it.
     */
    public function awaitsRefill(): bool
    {
        return ! $this->exhausted && $this->buffer === [];
    }

    public function isDone(): bool
    {
        return $this->exhausted && $this->buffer === [];
    }

    public function head(): BufferedHit|null
    {
        return $this->buffer[0] ?? null;
    }

    public function dropHead(): void
    {
        array_shift($this->buffer);
    }

    /**
     * Holds a head again that was taken but not shown, so the next call shows it first.
     */
    public function putBack(BufferedHit $head): void
    {
        array_unshift($this->buffer, $head);
    }

    /**
     * Ends this source for the search after a batch it could not use; its held hits are dropped with it.
     */
    public function fail(): void
    {
        $this->exhausted = true;
        $this->failed = true;
        $this->buffer = [];
    }

    /**
     * Whether this source's head comes before the other's in the one global order; a source without a head never
     * leads.
     */
    public function leads(self $other): bool
    {
        $head = $this->head();
        $otherHead = $other->head();

        return $head !== null && ($otherHead === null || $head->compare($otherHead) < 0);
    }

    /**
     * Takes a batch's outcome into this progress; false when a scan reported the position already held, so the call
     * made no progress.
     */
    public function take(BatchOutcome $outcome): bool
    {
        if ($outcome->isFailure()) {
            $this->fail();

            return true;
        }

        $next = $outcome->nextPosition();
        $isStalled = ! $outcome->canCarryHits() && $next !== null && $this->position?->equals($next) === true;

        if ($isStalled) {
            return false;
        }

        $this->position = $next ?? $this->position;
        $this->exhausted = $outcome->isLastBatch();

        return true;
    }
}
