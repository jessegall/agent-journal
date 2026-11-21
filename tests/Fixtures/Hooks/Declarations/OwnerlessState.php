<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\Declarations;

use App\Hooks\Attributes\StackWide;
use App\Hooks\States\AgentState;
use App\Hooks\Values\EventCommands;
use Domain\Plans\Api\Events\PlanProgressChanged;

/**
 * A state that listens to a domain's event from outside every domain and Core, which the declarations refuse at boot.
 */
final class OwnerlessState extends AgentState
{
    #[StackWide]
    public function onPlanProgressChanged(PlanProgressChanged $event): EventCommands
    {
        return EventCommands::none();
    }
}
