<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\Declarations;

use App\Support\States\AgentState;
use Domain\Plans\Events\PlanProgressChanged;

/**
 * A state that listens to a domain's event from outside every domain and Core, which the declarations refuse at boot.
 */
final class OwnerlessState extends AgentState
{
    public function onPlanProgressChanged(PlanProgressChanged $event): void
    {
    }
}
