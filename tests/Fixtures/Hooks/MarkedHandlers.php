<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Hooks\Attributes\StackWide;
use App\Hooks\Decisions\Decision;
use App\Hooks\Inputs\StopRequested;
use App\Hooks\Values\EventCommands;
use Domain\Tasks\Events\TaskStarted as Started;

/**
 * Marked methods that can be inherited or replaced by a state.
 */
trait MarkedHandlers
{
    #[StackWide]
    public function onStop(StopRequested $input): Decision
    {
        return Decision::delegate();
    }

    #[StackWide]
    public function onTaskStarted(Started $event): EventCommands
    {
        return EventCommands::none();
    }
}
