<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\Stacks;

use App\Support\States\AgentState;

/**
 * A fixture state for one subject that a test can mark finished.
 */
final class FinishableState extends AgentState
{
    public function __construct(private readonly bool $finished) {}

    public function isFinished(): bool
    {
        return $this->finished;
    }
}
