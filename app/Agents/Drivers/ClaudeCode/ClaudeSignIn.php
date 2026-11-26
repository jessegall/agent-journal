<?php

declare(strict_types=1);

namespace App\Agents\Drivers\ClaudeCode;

use App\Accounts\Contracts\SignInProtocol;
use App\Accounts\Enums\SignInMethod;
use App\Agents\Drivers\Setup\SignInDriver;
use App\Agents\Values\SecretHandover;
use App\Exceptions\SignInCodeInvalid;
use App\Support\PrivateAccountProcess;
use App\Values\SignInCard;
use App\Values\SignInChallenge;
use App\Values\SignInCode;
use App\Values\SignInHosts;
use App\Values\SignInIdentity;
use App\Values\SignInVerification;

/**
 * Claude Code's own sign-in into one private account folder: `claude auth login --claudeai` with the folder as
 * CLAUDE_CONFIG_DIR, the address read from its output, the user's code typed on its input, and `claude auth status
 * --json` as the check. The driver exchanges every token itself.
 */
final readonly class ClaudeSignIn implements SignInProtocol
{
    public function signInHosts(): SignInHosts
    {
        return SignInHosts::anthropic();
    }

    public function begin(SignInDriver $driver, string $directory): PrivateAccountProcess
    {
        return $driver->start(['auth', 'login', '--claudeai'], $directory, SecretHandover::none());
    }

    public function challengeFrom(PrivateAccountProcess $process): SignInChallenge|null
    {
        $address = $this->addressFrom($process);

        if ($address === null) {
            return null;
        }

        return new SignInChallenge($address, null);
    }

    public function canTakeAnswer(): bool
    {
        return true;
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
    public function prove(SignInDriver $driver, PrivateAccountProcess $process, string $directory): SignInVerification
    {
        $verification = $this->verify($driver, $directory);

        if ($process->exitCode() === 0) {
            return $verification;
        }

        return new SignInVerification(false, SignInIdentity::unproved(), $verification->isCertain);
    }

    public function verify(SignInDriver $driver, string $directory): SignInVerification
    {
        $status = $driver->status($directory, SecretHandover::none());
        $isSignedIn = $status->isSignedInBy(SignInMethod::OAuth);

        $identity = $isSignedIn
            ? new SignInIdentity($status->email, null, null, $status->expiresAt)
            : SignInIdentity::unproved();

        return new SignInVerification($isSignedIn, $identity, $status->isReadable);
    }

    public function signOut(SignInDriver $driver, string $directory): void
    {
        $driver->signOut($directory);
    }

    /**
     * The address the user opens to approve the sign-in, as the driver printed it; none until it did.
     */
    public function addressFrom(PrivateAccountProcess $process): string|null
    {
        if (preg_match('~https://\S+~', $process->output(), $match) === 1) {
            return $match[0];
        }

        return null;
    }

    /**
     * Types the user's code into the driver; a code that is empty, too long or holds a control character never
     * reaches it.
     *
     * @throws SignInCodeInvalid
     */
    public function submitCode(PrivateAccountProcess $process, string $code): void
    {
        $process->send(SignInCode::from($code)->code);
    }

    public function card(): SignInCard
    {
        return new SignInCard(
            'Sign in with Claude',
            "Sign in on Claude's site, then paste the code it gives you.",
            'Your Claude subscription pays for what agents use.',
            null,
        );
    }
}
