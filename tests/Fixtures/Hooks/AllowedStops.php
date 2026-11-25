<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Support\Decisions\Decision;
use App\Support\Inputs\Values\HookIdentity;
use App\Support\States\Contracts\StopConditionGate;
use App\Values\StopAnswer;
use App\Values\SettledStopChecks;

/**
 * A stop gate for a session with no stop conditions: every stop is allowed.
 */
final readonly class AllowedStops implements StopConditionGate
{
    public function answer(HookIdentity $stop, SettledStopChecks $settled): StopAnswer
    {
        return StopAnswer::withoutAttempt(Decision::delegate());
    }
}
