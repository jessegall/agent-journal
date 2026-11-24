<?php

declare(strict_types=1);

namespace App\Contracts\Accounts;

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
    /**
     * Takes the next sign-in waiting for the host; none when nothing waits.
     */
    public function claim(): ClaimedSignIn|null;

    /**
     * Records how a claimed sign-in ended, with the identity it signed in as and the reason when it was refused.
     */
    public function report(
        ClaimedSignIn $claimed,
        SignInOutcome $outcome,
        SignInIdentity $identity,
        string|null $refusal = null,
    ): void;

    /**
     * Shows the user the challenge a claimed sign-in asks them to answer, such as a code to enter.
     */
    public function publishChallenge(ClaimedSignIn $claimed, SignInChallenge $challenge): void;

    /**
     * Takes the next account check waiting for the host; none when nothing waits.
     */
    public function claimCheck(): ClaimedAccountCheck|null;

    /**
     * Records the result of a claimed account check.
     */
    public function reportCheck(ClaimedAccountCheck $claimed, AccountCheckResult $accountCheck): void;

    /**
     * Takes the next account folder cleanup waiting for the host; none when nothing waits.
     */
    public function claimCleanup(): ClaimedCleanup|null;

    /**
     * Tells the journal which sign-ins the runner still runs, so the others it took end as interrupted.
     *
     * @param  list<string>  $runningAttemptIds
     */
    public function reconcileSignIns(array $runningAttemptIds): void;

    /**
     * Records how far a claimed cleanup got, so an unfinished one is tried again.
     */
    public function reportCleanup(ClaimedCleanup $claimed, CleanupProgress $progress): void;

    /**
     * Whether the attempt is still live in the generation the host runs it in, with the code the user typed, once.
     */
    public function poll(ClaimedSignIn $claimed): SignInPoll;
}
