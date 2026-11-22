<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * What the host reports about the sign-in it runs: the driver now waits for its user, the driver's own check
 * shows the account signed in, or the sign-in failed. Nothing else, and never the driver's own output.
 */
enum SignInOutcome: string
{
    case Waiting = 'waiting';
    case Verified = 'verified';
    case Failed = 'failed';
    case Interrupted = 'interrupted';
}
