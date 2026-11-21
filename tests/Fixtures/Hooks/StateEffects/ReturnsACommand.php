<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\StateEffects;

use App\Hooks\Commands\FocusInstruction;
use App\Hooks\Lifecycle\LifecycleContext;
use App\Hooks\States\AgentState;
use App\Hooks\Values\LifecycleCommands;

/**
 * A state that only constructs and returns a command for the engine to run, which the state effects check allows.
 */
final class ReturnsACommand extends AgentState
{
    public function onEnter(LifecycleContext $context): LifecycleCommands
    {
        return LifecycleCommands::of(new FocusInstruction());
    }
}
