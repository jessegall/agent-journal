<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Hooks\States\AgentState;

/**
 * A state whose marked hook and event methods are supplied by a trait.
 */
class MarkedState extends AgentState
{
    use MarkedHandlers;
}
