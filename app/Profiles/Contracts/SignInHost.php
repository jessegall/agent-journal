<?php

declare(strict_types=1);

namespace App\Profiles\Contracts;

use App\Profiles\Enums\AccountCheckResult;
use App\Profiles\Enums\SignInOutcome;
use App\Profiles\Values\ClaimedAccountCheck;
use App\Profiles\Values\ClaimedSignIn;
use App\Profiles\Values\SignInChallenge;

/**
 * The journal as the host's sign-in runner reaches it: take the next sign-in, and report a safe outcome of one.
 */
interface SignInHost
{
    public function claim(): ClaimedSignIn|null;

    public function report(ClaimedSignIn $claimed, SignInOutcome $outcome, string|null $identity): void;

    public function publishChallenge(ClaimedSignIn $claimed, SignInChallenge $challenge): void;

    public function claimCheck(): ClaimedAccountCheck|null;

    public function reportCheck(ClaimedAccountCheck $claimed, AccountCheckResult $result): void;

    /**
     * The code the person typed for the sign-in, handed over once; none while none waits.
     */
    public function pendingCode(ClaimedSignIn $claimed): string|null;
}
