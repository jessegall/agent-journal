<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Support\Decisions\Decision;
use App\Support\Inputs\Values\HookIdentity;
use App\Support\States\Contracts\StopConditionGate;
use App\Values\StopAnswer;
use App\Values\SettledStopChecks;

/**
 * A stop gate that opens an attempt named after each stop callback and keeps the failures it was last asked with.
 */
final class CountingStops implements StopConditionGate
{
    public SettledStopChecks $lastSettled;

    public function answer(HookIdentity $stop, SettledStopChecks $settled): StopAnswer
    {
        $this->lastSettled = $settled;

        return StopAnswer::forAttempt($stop->hookId, Decision::delegate());
    }
}
