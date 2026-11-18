<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Hooks\Contracts\ConditionalState;
use App\Hooks\States\AgentState;

/**
 * A test state that is on or off as it was built, and counts how often it was asked.
 */
final class SwitchableState extends AgentState implements ConditionalState
{
    public int $askedCount = 0;

    public function __construct(private readonly bool $enabled) {}

    public function isEnabled(): bool
    {
        $this->askedCount++;

        return $this->enabled;
    }
}
