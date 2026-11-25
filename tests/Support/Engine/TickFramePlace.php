<?php

declare(strict_types=1);

namespace Tests\Support\Engine;

/**
 * Where a ticking frame a test made sits: its stack, its position on that stack and its frame id.
 */
final readonly class TickFramePlace
{
    public function __construct(public string $stackId, public int $position, public string $frameId) {}

    /**
     * Orders two places by stack, then by position on the stack.
     */
    public function compare(self $other): int
    {
        return [$this->stackId, $this->position] <=> [$other->stackId, $other->position];
    }
}
