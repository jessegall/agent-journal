<?php

declare(strict_types=1);

namespace App\Processes\Contracts;

use App\Processes\Values\TimingVerdict;

/**
 * Whether the calling actor may run a test or check now (plan 14, decision D18): Core allows it by default, and a
 * domain that knows plan phases fills this to hold checks until the phase's tasks are written.
 */
interface VerificationTiming
{
    public function forCaller(): TimingVerdict;
}
