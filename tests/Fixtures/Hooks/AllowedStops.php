<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Hooks\Inputs\Values\HookIdentity;
use App\Hooks\States\Contracts\StopConditionGate;

/**
 * A stop gate for a session with no stop conditions: every stop is allowed.
 */
final readonly class AllowedStops implements StopConditionGate
{
    public function answer(HookIdentity $stop): null
    {
        return null;
    }
}
