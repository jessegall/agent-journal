<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Profiles\Contracts\SignInProtocol;
use App\Profiles\Exceptions\SignInSecretUnwritable;
use App\Profiles\Values\SignInChallenge;
use App\Profiles\Values\SignInIdentity;
use App\Profiles\Values\SignInVerification;

/**
 * A Claude Code sign-in by a value the owner gives: no program runs until the value arrives, then it is written to a
 * private file in the account folder, which the program reads at every launch, never through its arguments or its
 * environment. The status names the method, and one short model call proves the value works.
 */
abstract readonly class ClaudeSecretSignIn implements SignInProtocol
{
    public function __construct(protected ClaudeProgram $claude) {}

    public function begin(string $directory): PrivateAccountProcess
    {
        return PrivateAccountProcess::holding($directory);
    }

    public function challengeFrom(PrivateAccountProcess $process): SignInChallenge|null
    {
        return null;
    }

    /**
     * Keeps the value in its own file, created only for the owner, lets the program find it, and ends the wait.
     */
    public function acceptCode(PrivateAccountProcess $process, string $code): void
    {
        $directory = $process->workingDirectory();
        $path = $this->secretFile($directory);
        $file = fopen($path, 'x') ?: throw SignInSecretUnwritable::in($directory);
        chmod($path, 0600);
        fwrite($file, $code);
        fclose($file);
        $this->install($directory);
        $process->release();
    }

    public function hasFinished(PrivateAccountProcess $process): bool
    {
        return ! $process->isRunning();
    }

    public function prove(PrivateAccountProcess $process, string $directory): SignInVerification
    {
        $verification = $this->verify($directory);
        $answers = $verification->isSignedIn
            && $this->claude->answersModel($directory, $this->variables($directory), $this->readFiles($directory));

        return $answers ? $verification : new SignInVerification(false, SignInIdentity::unproved());
    }

    /**
     * Signed in when the value's file is there and the status names this method in this folder; another method,
     * such as a claude.ai login found in the folder, is the wrong one.
     */
    public function verify(string $directory): SignInVerification
    {
        if (! is_file($this->secretFile($directory))) {
            return new SignInVerification(false, SignInIdentity::unproved());
        }

        $status = $this->claude->status($directory, $this->variables($directory), $this->readFiles($directory));
        $isSignedIn = $status->isSignedInBy($this->authMethod(), $directory);
        $identity = $isSignedIn ? new SignInIdentity(null, null, null, $status->expiresAt) : SignInIdentity::unproved();

        return new SignInVerification($isSignedIn, $identity, $status->isReadable);
    }

    public function signOut(string $directory): void
    {
        $this->uninstall($directory);

        if (is_file($this->secretFile($directory))) {
            unlink($this->secretFile($directory));
        }
    }

    /**
     * The file in the account folder that holds the value.
     */
    abstract protected function secretFile(string $directory): string;

    /**
     * The authMethod the status prints for this method.
     */
    abstract protected function authMethod(): string;

    /**
     * Lets the program find the value at launch, beside its file.
     */
    abstract protected function install(string $directory): void;

    abstract protected function uninstall(string $directory): void;

    /**
     * @return array<string, string>
     */
    abstract protected function variables(string $directory): array;

    /**
     * @return array<int, string>
     */
    abstract protected function readFiles(string $directory): array;
}
