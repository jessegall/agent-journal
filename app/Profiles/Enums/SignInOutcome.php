<?php

declare(strict_types=1);

namespace App\Profiles\Enums;

/**
 * What the host reports about the sign-in it runs: the program now waits for its user, the program's own check
 * shows the account signed in, or the sign-in failed. Nothing else, and never the program's own output.
 */
enum SignInOutcome: string
{
    case Waiting = 'waiting';
    case Verified = 'verified';
    case Failed = 'failed';
    case Interrupted = 'interrupted';
}
