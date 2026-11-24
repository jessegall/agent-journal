<?php

declare(strict_types=1);

namespace App\Contracts\Time;

use App\Values\TimingVerdict;

/**
 * Whether the calling actor may run a test or check now: Core allows it by default, and a
 * domain that knows plan phases fills this to hold checks until the phase's tasks are written.
 */
interface VerificationTiming
{
    /**
     * Whether the caller's verification ran within its time, and how long it took.
     */
    public function forCaller(): TimingVerdict;
}
