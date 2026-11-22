<?php

declare(strict_types=1);

namespace Tests\Fixtures\Profiles;

use App\Contracts\Accounts\SignInHost;
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
 * A host that hands out one sign-in and remembers each report.
 */
final class RecordingSignInHost implements SignInHost
{
    /**
     * How many polls answer live before the journal is said to have ended the attempt.
     */
    public int $livePolls = PHP_INT_MAX;

    public int $pollCount = 0;

    /**
     * The answer the next live poll hands out, once.
     */
    public string|null $answer = null;

    /**
     * @var list<SignInOutcome>
     */
    public array $outcomes = [];

    /**
     * @var list<string|null>
     */
    public array $identities = [];

    /**
     * @var list<string|null>
     */
    public array $refusals = [];

    /**
     * @var list<SignInChallenge>
     */
    public array $challenges = [];

    /**
     * @var list<AccountCheckResult>
     */
    public array $checks = [];

    public ClaimedAccountCheck|null $nextCheck = null;

    /**
     * @var list<CleanupProgress>
     */
    public array $cleanups = [];

    public ClaimedCleanup|null $nextCleanup = null;

    /**
     * @var list<list<string>>
     */
    public array $reconciled = [];

    public function __construct(private ClaimedSignIn|null $next) {}

    public function claim(): ClaimedSignIn|null
    {
        [$claimed, $this->next] = [$this->next, null];

        return $claimed;
    }

    public function publishChallenge(ClaimedSignIn $claimed, SignInChallenge $challenge): void
    {
        $this->challenges[] = $challenge;
    }

    public function reconcileSignIns(array $runningAttemptIds): void
    {
        $this->reconciled[] = $runningAttemptIds;
    }

    public function claimCleanup(): ClaimedCleanup|null
    {
        [$claimed, $this->nextCleanup] = [$this->nextCleanup, null];

        return $claimed;
    }

    public function reportCleanup(ClaimedCleanup $claimed, CleanupProgress $progress): void
    {
        $this->cleanups[] = $progress;
    }

    public function claimCheck(): ClaimedAccountCheck|null
    {
        [$claimed, $this->nextCheck] = [$this->nextCheck, null];

        return $claimed;
    }

    public function reportCheck(ClaimedAccountCheck $claimed, AccountCheckResult $result): void
    {
        $this->checks[] = $result;
    }

    public function poll(ClaimedSignIn $claimed): SignInPoll
    {
        $this->pollCount++;
        [$answer, $this->answer] = [$this->answer, null];

        return new SignInPoll($this->pollCount < $this->livePolls, $answer);
    }

    public function report(
        ClaimedSignIn $claimed,
        SignInOutcome $outcome,
        SignInIdentity $identity,
        string|null $refusal = null,
    ): void {
        $this->outcomes[] = $outcome;
        $this->identities[] = $identity->display;
        $this->refusals[] = $refusal;
    }
}
