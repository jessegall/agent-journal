<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Support\Decisions\Decision;
use App\Support\Inputs\Values\HookIdentity;
use App\Support\States\Contracts\StopConditionGate;

/**
 * A stop gate for a session with no stop conditions: every stop is allowed.
 */
final readonly class AllowedStops implements StopConditionGate
{
    public function answer(HookIdentity $stop): Decision
    {
        return Decision::delegate();
    }
}
