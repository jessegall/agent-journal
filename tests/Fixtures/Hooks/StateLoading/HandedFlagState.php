<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\StateLoading;

use App\Support\States\AgentState;

/**
 * A state handed a flag worked out for it, which the state machine forbids.
 */
final class HandedFlagState extends AgentState
{
    public function __construct(private readonly bool $isOpen) {}

    public function isFinished(): bool
    {
        return ! $this->isOpen;
    }
}
