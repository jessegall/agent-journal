<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Enums\AccountCheckResult;
use App\Enums\SignInOutcome;
use App\Values\ClaimedAccountCheck;
use App\Values\ClaimedCleanup;
use App\Values\ClaimedSignIn;
use App\Values\CleanupProgress;
use App\Values\SignInChallenge;
use App\Values\SignInIdentity;
use App\Values\SignInPoll;

/**
 * The journal as the host's sign-in runner reaches it: take the next sign-in, and report a safe outcome of one.
 */
interface SignInHost
{
    public function claim(): ClaimedSignIn|null;

    public function report(
        ClaimedSignIn $claimed,
        SignInOutcome $outcome,
        SignInIdentity $identity,
        string|null $refusal = null,
    ): void;

    public function publishChallenge(ClaimedSignIn $claimed, SignInChallenge $challenge): void;

    public function claimCheck(): ClaimedAccountCheck|null;

    public function reportCheck(ClaimedAccountCheck $claimed, AccountCheckResult $accountCheck): void;

    public function claimCleanup(): ClaimedCleanup|null;

    /**
     * Tells the journal which sign-ins the runner still runs, so the others it took end as interrupted.
     *
     * @param  list<string>  $runningAttemptIds
     */
    public function reconcileSignIns(array $runningAttemptIds): void;

    public function reportCleanup(ClaimedCleanup $claimed, CleanupProgress $progress): void;

    /**
     * Whether the attempt is still live in the generation the host runs it in, with the code the user typed, once.
     */
    public function poll(ClaimedSignIn $claimed): SignInPoll;
}
