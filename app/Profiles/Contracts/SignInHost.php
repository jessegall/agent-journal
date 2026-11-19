<?php

declare(strict_types=1);

namespace App\Profiles\Contracts;

use App\Profiles\Enums\SignInOutcome;
use App\Profiles\Values\ClaimedSignIn;

/**
 * The journal as the host's sign-in runner reaches it: take the next sign-in, and report a safe outcome of one.
 */
interface SignInHost
{
    public function claim(): ClaimedSignIn|null;

    public function report(ClaimedSignIn $claimed, SignInOutcome $outcome, string|null $identity): void;
}
