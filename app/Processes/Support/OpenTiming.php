<?php

declare(strict_types=1);

namespace App\Processes\Support;

use App\Processes\Contracts\VerificationTiming;
use App\Processes\Values\TimingVerdict;

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
