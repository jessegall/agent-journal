<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Agents\Enums\ArrangementType;
use App\Files\Contracts\Files;
use App\Files\Enums\Place;
use App\Profiles\Contracts\AccountFolders;
use App\Profiles\Contracts\AccountOwnerDrain;
use App\Profiles\Contracts\SignInHost;
use App\Profiles\Contracts\SignInProtocol;
use App\Profiles\Enums\AccountCheckResult;
use App\Profiles\Enums\SignInOutcome;
use App\Profiles\Exceptions\SignInAnswerUndelivered;
use App\Profiles\Exceptions\SignInSecretUnwritable;
use App\Profiles\Values\ClaimedCleanup;
use App\Profiles\Values\ClaimedSignIn;
use App\Profiles\Values\CleanupProgress;
use App\Profiles\Values\SignInIdentity;
use Carbon\CarbonImmutable;
use Closure;

/**
 * The host's sign-in runner: takes one sign-in, makes its private folder, runs the driver's own sign-in until it
 * ends or its deadline passes, checks the folder with the driver's own check, and reports only a safe outcome.
 * It runs on the host, outside the app's containers, and never sends the driver's output anywhere.
 */
final readonly class PrivateSignInProcesses
{
    /**
     * @param  Closure(): void  $pause
     */
    public function __construct(
        private SignInHost $host,
        private SignInProtocols $protocols,
        private Closure $pause,
        private Files $files,
        private AccountFolders $folders,
        private AccountOwnerDrain $owners = new HostAccountDrain('', ArrangementType::Local),
    ) {}

    /**
     * Runs the next sign-in to its end and answers whether there was one.
     */
    public function runNext(): bool
    {
        $claimed = $this->host->claim();

        if ($claimed === null) {
            return false;
        }

        if (! $this->protocols->supports($claimed->driver, $claimed->method)) {
            $this->host->report($claimed, SignInOutcome::Failed, SignInIdentity::unproved());

            return true;
        }

        $protocol = $this->protocols->for($claimed->driver, $claimed->method);

        if (! $this->owners->drain($claimed->directory, $claimed->accountId)) {
            $this->host->report($claimed, SignInOutcome::Failed, SignInIdentity::unproved());

            return true;
        }

        $this->makePrivateFolder($claimed->directory);
        $process = $protocol->begin($claimed->directory);
        $this->host->report($claimed, SignInOutcome::Waiting, SignInIdentity::unproved());

        if (! $this->waitForEnd($protocol, $process, $claimed) || $this->isPastDeadline($claimed)) {
            $process->stop();

            return true;
        }

        $verification = $protocol->prove($process, $claimed->directory);
        $process->stop();
        $outcome = $verification->isSignedIn ? SignInOutcome::Verified : SignInOutcome::Failed;
        $this->host->report($claimed, $outcome, $verification->identity, $verification->refusal);

        return true;
    }

    /**
     * Tells the journal, as the runner starts, that it runs no sign-in: one it took before a restart was lost with it.
     */
    public function reconcileAtStart(): void
    {
        $this->host->reconcileSignIns([]);
    }

    /**
     * Runs the next account check with the driver's own status check and answers whether there was one; only a
     * certain answer is reported as signed in or out.
     */
    public function checkNext(): bool
    {
        $claimed = $this->host->claimCheck();

        if ($claimed === null) {
            return false;
        }

        if (! $this->protocols->supports($claimed->driver, $claimed->method)) {
            $this->host->reportCheck($claimed, AccountCheckResult::Unknown);

            return true;
        }

        $verification = $this->protocols->for($claimed->driver, $claimed->method)->verify($claimed->directory);

        $accountCheck = match (true) {
            ! $verification->isCertain => AccountCheckResult::Unknown,
            $verification->isSignedIn => AccountCheckResult::SignedIn,
            default => AccountCheckResult::SignedOut,
        };

        $this->host->reportCheck($claimed, $accountCheck);

        return true;
    }

    /**
     * Runs the next cleanup: the driver signs the folder out and its own certain check must show no sign-in left
     * before the folder is deleted; each proof is reported on its own, and a failed step is tried again later.
     */
    public function cleanNext(): bool
    {
        $claimed = $this->host->claimCleanup();

        if ($claimed === null) {
            return false;
        }

        if ($this->isStillBound($claimed)) {
            $this->host->reportCleanup($claimed, CleanupProgress::stillBound());

            return true;
        }

        $isStoreRemoved = $claimed->isStoreRemoved || $this->removeStore($claimed);
        $isDirectoryRemoved = $isStoreRemoved && $this->removeDirectory($claimed->directory);
        $this->host->reportCleanup($claimed, new CleanupProgress($isStoreRemoved, $isDirectoryRemoved));

        return true;
    }

    /**
     * Whether the cleanup's sign-in is gone: a folder that is gone holds none, so its driver is never started in it.
     */
    private function removeStore(ClaimedCleanup $claimed): bool
    {
        if ($this->isGone($claimed->directory)) {
            return true;
        }

        $isServed = $this->protocols->supports($claimed->driver, $claimed->method);

        if (! $isServed || ! $this->isUnused($claimed)) {
            return false;
        }

        $protocol = $this->protocols->for($claimed->driver, $claimed->method);

        $protocol->signOut($claimed->directory);
        $verification = $protocol->verify($claimed->directory);

        return $verification->isCertain && ! $verification->isSignedIn;
    }

    /**
     * Whether a live account's displaced folder is still used by a running session, which keeps it to the end of its
     * run; a removed account's folder and a new account's staging folder never are.
     */
    private function isStillBound(ClaimedCleanup $claimed): bool
    {
        return $claimed->isDisplacedFolder() && ! $this->isGone($claimed->directory)
            && ! $this->owners->isDisplacedFolderFree($claimed->directory, (string) $claimed->accountId);
    }

    /**
     * Whether nothing runs on the folder any more: a displaced folder was already found free, any other is drained.
     */
    private function isUnused(ClaimedCleanup $claimed): bool
    {
        return $claimed->isDisplacedFolder() || $this->owners->drain($claimed->directory, $claimed->accountId);
    }

    private function removeDirectory(string $directory): bool
    {
        $this->folders->remove($directory);

        return $this->isGone($directory);
    }

    /**
     * Whether nothing is left at the account folder: no link, no folder and no file.
     */
    private function isGone(string $directory): bool
    {
        $folder = $this->files->pathIn(Place::Accounts, $directory);

        return ! $this->files->isLink($folder) && ! $this->files->isFolder($folder) && ! $this->files->exists($folder);
    }

    /**
     * Runs the sign-in until the driver finishes, the attempt expires or the journal ends it, and answers whether
     * the attempt is still live; a code reaches the driver only from a live poll.
     */
    private function waitForEnd(SignInProtocol $protocol, PrivateAccountProcess $process, ClaimedSignIn $claimed): bool
    {
        $deadline = CarbonImmutable::parse($claimed->expiresAt);
        $isPublished = false;

        while (! $protocol->hasFinished($process) && CarbonImmutable::now()->lessThan($deadline)) {
            $isPublished = $isPublished || $this->publishChallenge($protocol, $process, $claimed);
            $poll = $this->host->poll($claimed);

            if (! $poll->isLive) {
                return false;
            }

            if ($poll->code !== null && ! $this->deliver($protocol, $process, $claimed, $poll->code)) {
                return false;
            }

            ($this->pause)();
        }

        return true;
    }

    /**
     * Whether the attempt's deadline has come: no proof starts then, and the journal ends the attempt Expired.
     */
    private function isPastDeadline(ClaimedSignIn $claimed): bool
    {
        return ! CarbonImmutable::now()->lessThan(CarbonImmutable::parse($claimed->expiresAt));
    }

    /**
     * Hands the user's answer to the driver and answers whether it arrived whole; one that may have arrived in part
     * ends the attempt interrupted, since an answer the driver may have taken is never given again.
     */
    private function deliver(
        SignInProtocol $protocol,
        PrivateAccountProcess $process,
        ClaimedSignIn $claimed,
        string $answer,
    ): bool {
        try {
            $protocol->acceptCode($process, $answer);
        } catch (SignInAnswerUndelivered|SignInSecretUnwritable $broken) {
            $this->host->report($claimed, SignInOutcome::Interrupted, SignInIdentity::unproved(), $broken->getMessage());

            return false;
        }

        return true;
    }

    /**
     * Hands the user the driver's challenge once it printed one, and answers whether it did.
     */
    private function publishChallenge(
        SignInProtocol $protocol,
        PrivateAccountProcess $process,
        ClaimedSignIn $claimed,
    ): bool {
        $challenge = $protocol->challengeFrom($process);

        if ($challenge === null) {
            return false;
        }

        $this->host->publishChallenge($claimed, $challenge);

        return true;
    }

    /**
     * The account folder, only the host user may enter it, and every file it holds is private to that user.
     */
    private function makePrivateFolder(string $directory): void
    {
        $this->folders->make($directory);
        umask(0077);
    }
}
