<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Profiles\Contracts\SignInHost;
use App\Profiles\Contracts\SignInProtocol;
use App\Profiles\Enums\SignInOutcome;
use App\Profiles\Exceptions\SignInProtocolMissing;
use App\Profiles\Values\ClaimedSignIn;
use Carbon\CarbonImmutable;
use Closure;

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

        try {
            $protocol = $this->protocols->for($claimed->program);
        } catch (SignInProtocolMissing) {
            $this->host->report($claimed, SignInOutcome::Failed, null);

            return true;
        }

        self::makePrivateFolder($claimed->directory);
        $process = $protocol->begin($claimed->directory);
        $this->host->report($claimed, SignInOutcome::Waiting, null);
        $this->waitForEnd($protocol, $process, $claimed);

        $verification = $protocol->verify($claimed->directory);
        $outcome = $verification->isSignedIn ? SignInOutcome::Verified : SignInOutcome::Failed;
        $this->host->report($claimed, $outcome, $verification->identity);

        return true;
    }

    private function waitForEnd(SignInProtocol $protocol, PrivateAccountProcess $process, ClaimedSignIn $claimed): void
    {
        $deadline = CarbonImmutable::parse($claimed->expiresAt);
        $isPublished = false;

        while (! $protocol->hasFinished($process) && CarbonImmutable::now()->lessThan($deadline)) {
            $isPublished = $isPublished || $this->publishChallenge($protocol, $process, $claimed);
            $code = $this->host->pendingCode($claimed);

            if ($code !== null) {
                $protocol->acceptCode($process, $code);
            }

            ($this->pause)();
        }

        $process->stop();
    }

    /**
     * Hands the person the program's challenge once it printed one, and answers whether it did.
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
