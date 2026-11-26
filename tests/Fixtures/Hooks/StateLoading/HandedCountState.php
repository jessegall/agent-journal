<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\StateLoading;

use App\Stacks\AgentState;

/**
 * A state handed a count it then changes itself, which belongs in a property of its own instead.
 */
final class HandedCountState extends AgentState
{
    public function __construct(private int $toolUses) {}

    public function isFinished(): bool
    {
        return $this->toolUses > 4;
    }

    public function useTool(): void
    {
        $this->toolUses++;
    }
}
