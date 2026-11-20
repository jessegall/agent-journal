<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Agents\Enums\ArrangementType;
use App\Profiles\Contracts\AccountOwnerDrain;
use App\Profiles\Contracts\SignInHost;
use App\Profiles\Contracts\SignInProtocol;
use App\Profiles\Enums\AccountCheckResult;
use App\Profiles\Enums\SignInOutcome;
use App\Profiles\Values\ClaimedCleanup;
use App\Profiles\Values\ClaimedSignIn;
use App\Profiles\Values\CleanupProgress;
use App\Profiles\Values\SignInIdentity;
use Carbon\CarbonImmutable;
use Closure;
use Illuminate\Filesystem\Filesystem;

/**
 * The host's sign-in runner: takes one sign-in, makes its private folder, runs the program's own sign-in until it
 * ends or its deadline passes, checks the folder with the program's own check, and reports only a safe outcome.
 * It runs on the host, outside the app's containers, and never sends the program's output anywhere.
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

        if (! $this->protocols->supports($claimed->program, $claimed->method)) {
            $this->host->report($claimed, SignInOutcome::Failed, SignInIdentity::unproved());

            return true;
        }

        $protocol = $this->protocols->for($claimed->program, $claimed->method);

        if (! $this->owners->drain($claimed->directory, $claimed->accountId)) {
            $this->host->report($claimed, SignInOutcome::Failed, SignInIdentity::unproved());

            return true;
        }

        self::makePrivateFolder($claimed->directory);
        $process = $protocol->begin($claimed->directory);
        $this->host->report($claimed, SignInOutcome::Waiting, SignInIdentity::unproved());

        if (! $this->waitForEnd($protocol, $process, $claimed)) {
            $process->stop();

            return true;
        }

        $verification = $protocol->prove($process, $claimed->directory);
        $process->stop();
        $outcome = $verification->isSignedIn ? SignInOutcome::Verified : SignInOutcome::Failed;
        $this->host->report($claimed, $outcome, $verification->identity);

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
     * Runs the next account check with the program's own status check and answers whether there was one; only a
     * certain answer is reported as signed in or out.
     */
    public function checkNext(): bool
    {
        $claimed = $this->host->claimCheck();

        if ($claimed === null) {
            return false;
        }

        if (! $this->protocols->supports($claimed->program, $claimed->method)) {
            $this->host->reportCheck($claimed, AccountCheckResult::Unknown);

            return true;
        }

        $verification = $this->protocols->for($claimed->program, $claimed->method)->verify($claimed->directory);

        $accountCheck = match (true) {
            ! $verification->isCertain => AccountCheckResult::Unknown,
            $verification->isSignedIn => AccountCheckResult::SignedIn,
            default => AccountCheckResult::SignedOut,
        };
        $this->host->reportCheck($claimed, $accountCheck);

        return true;
    }

    /**
     * Runs the next cleanup: the program signs the folder out and its own certain check must show no sign-in left
     * before the folder is deleted; each proof is reported on its own, and a failed step is tried again later.
     */
    public function cleanNext(): bool
    {
        $claimed = $this->host->claimCleanup();

        if ($claimed === null) {
            return false;
        }

        $isStoreRemoved = $claimed->isStoreRemoved || $this->removeStore($claimed);
        $isDirectoryRemoved = $isStoreRemoved && $this->removeDirectory($claimed->directory);
        $this->host->reportCleanup($claimed, new CleanupProgress($isStoreRemoved, $isDirectoryRemoved));

        return true;
    }

    private function removeStore(ClaimedCleanup $claimed): bool
    {
        $isServed = $this->protocols->supports($claimed->program, $claimed->method);

        if (! $isServed || ! $this->owners->drain($claimed->directory, $claimed->accountId)) {
            return false;
        }

        $protocol = $this->protocols->for($claimed->program, $claimed->method);

        $protocol->signOut($claimed->directory);
        $verification = $protocol->verify($claimed->directory);

        return $verification->isCertain && ! $verification->isSignedIn;
    }

    private function removeDirectory(string $directory): bool
    {
        if (is_dir($directory) && ! is_link($directory)) {
            new Filesystem()->deleteDirectory($directory);
        }

        return ! file_exists($directory);
    }

    /**
     * Runs the sign-in until the program finishes, the attempt expires or the journal ends it, and answers whether
     * the attempt is still live; a code reaches the program only from a live poll.
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

            if ($poll->code !== null) {
                $protocol->acceptCode($process, $poll->code);
            }

            ($this->pause)();
        }

        return true;
    }

    /**
     * Hands the user the program's challenge once it printed one, and answers whether it did.
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
    private static function makePrivateFolder(string $directory): void
    {
        if (! is_dir($directory)) {
            mkdir($directory, 0700, true);
        }

        chmod($directory, 0700);
        umask(0077);
    }
}
