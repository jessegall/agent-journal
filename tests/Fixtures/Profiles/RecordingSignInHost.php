<?php

declare(strict_types=1);

namespace Tests\Fixtures\Profiles;

use App\Contracts\Accounts\SignInHost;
use App\Enums\Accounts\AccountCheckResult;
use App\Enums\Accounts\SignInOutcome;
use App\Enums\Hosts\HostOrderStatus;
use App\Values\ClaimedAccountCheck;
use App\Values\ClaimedCleanup;
use App\Values\ClaimedSignIn;
use App\Values\CleanupProgress;
use App\Values\HostFolderAnswer;
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

    /**
     * The folder orders asked for, each as its kind and folder.
     *
     * @var list<string>
     */
    public array $folderOrders = [];

    /**
     * How the host answers every folder order.
     */
    public HostFolderAnswer $folderAnswer;

    public function __construct(private ClaimedSignIn|null $next)
    {
        $this->folderAnswer = new HostFolderAnswer(HostOrderStatus::Done, '', false);
    }

    public function orderFolderMake(string $folder, string $operation): string
    {
        $this->folderOrders[] = "make {$folder}";

        return 'order-'.count($this->folderOrders);
    }

    public function orderFolderRemove(string $folder, string $operation): string
    {
        $this->folderOrders[] = "remove {$folder}";

        return 'order-'.count($this->folderOrders);
    }

    public function orderFolderUse(string $folder, string $operation): string
    {
        $this->folderOrders[] = "use {$folder}";

        return 'order-'.count($this->folderOrders);
    }

    public function folderAnswer(string $orderId): HostFolderAnswer
    {
        return $this->folderAnswer;
    }

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

    public function notifyCleanup(ClaimedCleanup $claimed, CleanupProgress $progress): void
    {
        $this->cleanups[] = $progress;
    }

    public function claimCheck(): ClaimedAccountCheck|null
    {
        [$claimed, $this->nextCheck] = [$this->nextCheck, null];

        return $claimed;
    }

    public function notifyCheck(ClaimedAccountCheck $claimed, AccountCheckResult $result): void
    {
        $this->checks[] = $result;
    }

    public function poll(ClaimedSignIn $claimed): SignInPoll
    {
        $this->pollCount++;
        [$answer, $this->answer] = [$this->answer, null];

        return new SignInPoll($this->pollCount < $this->livePolls, $answer);
    }

    public function notify(
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
