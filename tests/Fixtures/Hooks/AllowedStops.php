<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Hooks\Contracts\StopConditionGate;
use App\Hooks\Decisions\Decision;
use App\Hooks\Inputs\HookIdentity;

/**
 * A stop gate for a session with no stop conditions: every stop is allowed.
 */
final readonly class AllowedStops implements StopConditionGate
{
    public function answer(HookIdentity $stop): Decision
    {
        return Decision::allow();
    }
}
