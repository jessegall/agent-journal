<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Files\Contracts\Files;
use App\Files\Enums\Place;
use App\Profiles\Contracts\SignInProtocol;
use App\Profiles\Exceptions\SignInCodeInvalid;
use App\Profiles\Values\SignInChallenge;
use App\Profiles\Values\SignInCode;
use App\Profiles\Values\SignInIdentity;
use App\Profiles\Values\SignInVerification;

/**
 * Claude Code's own sign-in on the host, into one private account folder: `claude auth login --claudeai` with the
 * folder as CLAUDE_CONFIG_DIR and nothing else of the host's configuration, the sign-in address read from its private
 * output, the user's code typed on its standard input, and `claude auth status --json` as the check. The program
 * exchanges every token itself; nothing here sees one.
 */
final readonly class ClaudeSignIn implements SignInProtocol
{
    public function __construct(private ClaudeDriver $claude, private Files $files) {}

    public function begin(string $directory): PrivateAccountProcess
    {
        return $this->claude->start(['auth', 'login', '--claudeai'], $directory);
    }

    public function challengeFrom(PrivateAccountProcess $process): SignInChallenge|null
    {
        $address = $this->addressFrom($process);

        return $address === null ? null : new SignInChallenge($address, null);
    }

    public function acceptCode(PrivateAccountProcess $process, string $code): void
    {
        $this->submitCode($process, $code);
    }

    public function hasFinished(PrivateAccountProcess $process): bool
    {
        return ! $process->isRunning();
    }

    /**
     * Signed in only when the login itself exited cleanly and the status then names a claude.ai login in exactly this
     * folder; the email is shown to the user and is never the account's subject.
     */
    public function prove(PrivateAccountProcess $process, string $directory): SignInVerification
    {
        $verification = $this->verify($directory);

        if ($process->exitCode() === 0) {
            return $verification;
        }

        return new SignInVerification(false, SignInIdentity::unproved(), $verification->isCertain);
    }

    public function verify(string $directory): SignInVerification
    {
        $status = $this->claude->status($directory);
        $realDirectory = $this->files->realPath($this->files->pathIn(Place::Accounts, $directory));
        $isSignedIn = $status->isSignedInBy('claude.ai', $directory, $realDirectory);
        $identity = $isSignedIn
            ? new SignInIdentity($status->email, null, null, $status->expiresAt)
            : SignInIdentity::unproved();

        return new SignInVerification($isSignedIn, $identity, $status->isReadable);
    }

    public function signOut(string $directory): void
    {
        $this->claude->start(['auth', 'logout'], $directory)->finish();
    }

    /**
     * The address the user opens to approve the sign-in, as the program printed it; none until it did.
     */
    public function addressFrom(PrivateAccountProcess $process): string|null
    {
        return preg_match('~https://\S+~', $process->output(), $match) === 1 ? $match[0] : null;
    }

    /**
     * Types the user's code into the program; a code that is empty, too long or holds a control character never
     * reaches it.
     *
     * @throws SignInCodeInvalid
     */
    public function submitCode(PrivateAccountProcess $process, string $code): void
    {
        $process->send(SignInCode::from($code)->code);
    }
}
