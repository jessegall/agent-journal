<?php

declare(strict_types=1);

namespace Tests\Fixtures\Profiles;

use App\Profiles\Values\SignInIdentity;
use App\Profiles\Contracts\SignInHost;
use App\Profiles\Enums\AccountCheckResult;
use App\Profiles\Enums\SignInOutcome;
use App\Profiles\Values\ClaimedAccountCheck;
use App\Profiles\Values\ClaimedCleanup;
use App\Profiles\Values\ClaimedSignIn;
use App\Profiles\Values\CleanupProgress;
use App\Profiles\Values\SignInChallenge;
use App\Profiles\Values\SignInPoll;

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
     * @var list<SignInOutcome>
     */
    public array $outcomes = [];

    /**
     * @var list<string|null>
     */
    public array $identities = [];

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

        return new SignInPoll($this->pollCount < $this->livePolls, null);
    }

    public function report(ClaimedSignIn $claimed, SignInOutcome $outcome, SignInIdentity $identity): void
    {
        $this->outcomes[] = $outcome;
        $this->identities[] = $identity->display;
    }
}
