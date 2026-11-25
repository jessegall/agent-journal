<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Support\States\AgentState;

/**
 * A state whose hook and listener methods are supplied by a trait.
 */
class InheritState extends AgentState
{
    use InheritedHandlers;
}
