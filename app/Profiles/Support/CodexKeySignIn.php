<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Profiles\Contracts\SignInProtocol;
use App\Profiles\Values\SignInChallenge;
use App\Profiles\Values\SignInIdentity;
use App\Profiles\Values\SignInVerification;

/**
 * Codex signed in by an API key: `codex login --with-api-key` waits for the key on its standard input, the only way
 * the key reaches it, and keeps it in the folder's own auth.json. Its status then says the key is configured, but
 * Codex checks the key only when a request is sent, so one short request proves it.
 */
final readonly class CodexKeySignIn implements SignInProtocol
{
    public function __construct(private CodexProgram $codex) {}

    public function begin(string $directory): PrivateAccountProcess
    {
        return $this->codex->start(['login', '--with-api-key'], $directory);
    }

    public function challengeFrom(PrivateAccountProcess $process): SignInChallenge|null
    {
        return null;
    }

    public function acceptCode(PrivateAccountProcess $process, string $code): void
    {
        $process->send($code);
        $process->closeInput();
    }

    public function hasFinished(PrivateAccountProcess $process): bool
    {
        return ! $process->isRunning();
    }

    /**
     * Signed in only when the login took the key and the status then says a key, not a ChatGPT login, is configured.
     */
    public function prove(PrivateAccountProcess $process, string $directory): SignInVerification
    {
        if ($process->exitCode() !== 0) {
            return new SignInVerification(false, SignInIdentity::unproved());
        }

        $verification = $this->verify($directory);

        if (! $verification->isSignedIn) {
            return $verification;
        }

        $refusal = $this->codex->modelRefusal($directory);

        return $refusal === null ? $verification : SignInVerification::refused($refusal);
    }

    public function verify(string $directory): SignInVerification
    {
        return $this->codex->status($directory)->signedInAs('API key configured');
    }

    public function signOut(string $directory): void
    {
        $this->codex->signOut($directory);
    }
}
