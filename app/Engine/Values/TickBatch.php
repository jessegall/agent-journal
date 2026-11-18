<?php

declare(strict_types=1);

namespace App\Engine\Values;

/**
 * The frames one pass ticks, in stack and frame order.
 */
final readonly class TickBatch
{
    /**
     * @param  list<TickCandidate>  $candidates
     */
    public function __construct(public array $candidates) {}

    public function isEmpty(): bool
    {
        return $this->candidates === [];
    }

    public function count(): int
    {
        return count($this->candidates);
    }
}
