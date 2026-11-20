<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Hooks\Attributes\StackWide;
use App\Hooks\Decisions\Decision;
use App\Hooks\Inputs\StopRequested;
use App\Hooks\States\AgentState;

/**
 * A stop decision that participates even below another matching handler.
 */
final class MarkedStopState extends AgentState
{
    public function __construct(private readonly Decision $decision) {}

    #[StackWide]
    public function onStop(StopRequested $input): Decision
    {
        return $this->decision;
    }
}
