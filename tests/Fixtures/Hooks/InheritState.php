<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Stacks\AgentState;

/**
 * A state whose hook and listener methods are supplied by a trait.
 */
class InheritState extends AgentState
{
    use InheritedHandlers;
}
