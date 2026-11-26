<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\Ticks;

use App\Stacks\AgentState;
use Tests\Support\Exceptions\SimulatedFailure;

/**
 * A state that does not tick and fails when it is built, so a test shows the engine never builds it.
 */
final class UnreadState extends AgentState
{
    public function __construct()
    {
        throw SimulatedFailure::of('A state type that does not tick was restored.');
    }
}
