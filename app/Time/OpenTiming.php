<?php

declare(strict_types=1);

namespace App\Time;

use App\Time\Contracts\VerificationTiming;
use App\Time\Values\TimingVerdict;

/**
 * Core's timing without plans: a test or check may always run.
 */
final readonly class OpenTiming implements VerificationTiming
{
    public function forCaller(): TimingVerdict
    {
        return TimingVerdict::allowed();
    }
}
