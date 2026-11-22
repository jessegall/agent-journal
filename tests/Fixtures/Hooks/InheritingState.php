<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Hooks\States\AgentState;

/**
 * A state whose hook and listener methods are supplied by a trait.
 */
class InheritingState extends AgentState
{
    use InheritedHandlers;
}
