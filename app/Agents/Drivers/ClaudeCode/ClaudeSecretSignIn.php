<?php

declare(strict_types=1);

namespace App\Agents\Drivers\ClaudeCode;

use App\Accounts\Contracts\SignInProtocol;
use App\Accounts\Enums\SignInMethod;
use App\Agents\Drivers\Setup\SignInDriver;
use App\Agents\Exceptions\FileExists;
use App\Agents\Exceptions\FileUnwritable;
use App\Agents\Exceptions\SignInSecretUnwritable;
use App\Agents\Values\SecretHandover;
use App\Files\Contracts\Files;
use App\Files\Enums\Permissions;
use App\Files\Enums\Place;
use App\Support\PrivateAccountProcess;
use App\Values\FilePath;
use App\Values\SignInChallenge;
use App\Values\SignInHosts;
use App\Values\SignInIdentity;
use App\Values\SignInVerification;

/**
 * A Claude Code sign-in by a value the owner gives: no driver runs until the value arrives, then it is written to a
 * private file in the account folder, which the driver reads at every start, never through its arguments or its
 * environment. The status names the method, and one short model call proves the value works.
 */
abstract readonly class ClaudeSecretSignIn implements SignInProtocol
{
    public function signInHosts(): SignInHosts
    {
        return SignInHosts::anthropic();
    }

    /**
     * Takes the files every sign-in by a secret uses.
     */
    public function __construct(protected Files $files) {}

    public function begin(SignInDriver $driver, string $directory): PrivateAccountProcess
    {
        return PrivateAccountProcess::holding($directory);
    }

    public function challengeFrom(PrivateAccountProcess $process): SignInChallenge|null
    {
        return null;
    }

    public function canTakeAnswer(): bool
    {
        return true;
    }

    /**
     * Keeps the value in its own file, created only for the owner, lets the driver find it, and ends the wait.
     */
    public function acceptCode(PrivateAccountProcess $process, string $code): void
    {
        $directory = $process->workingDirectory();

        try {
            $this->files->create($this->secretPath($directory), $code, Permissions::OwnerOnly);
        } catch (FileExists|FileUnwritable $failure) {
            throw SignInSecretUnwritable::in($directory, $failure);
        }

        $this->install($directory);
        $process->release();
    }

    public function hasFinished(PrivateAccountProcess $process): bool
    {
        return ! $process->isRunning();
    }

    public function prove(SignInDriver $driver, PrivateAccountProcess $process, string $directory): SignInVerification
    {
        $verification = $this->verify($driver, $directory);

        if (! $verification->isSignedIn) {
            return $verification;
        }

        $refusal = $driver->modelRefusal($directory, $this->handover($directory));

        if ($refusal === null) {
            return $verification;
        }

        return SignInVerification::refused($refusal);
    }

    /**
     * Signed in when the value's file is there and the status names this method in this folder; another method,
     * such as a claude.ai login found in the folder, is the wrong one.
     */
    public function verify(SignInDriver $driver, string $directory): SignInVerification
    {
        if (! $this->files->exists($this->secretPath($directory))) {
            return new SignInVerification(false, SignInIdentity::unproved());
        }

        $status = $driver->status($directory, $this->handover($directory));
        $isSignedIn = $status->isSignedInBy($this->method());
        $identity = $isSignedIn ? new SignInIdentity(null, null, null, $status->expiresAt) : SignInIdentity::unproved();

        return new SignInVerification($isSignedIn, $identity, $status->isReadable);
    }

    public function signOut(SignInDriver $driver, string $directory): void
    {
        $this->uninstall($directory);

        $this->files->delete($this->secretPath($directory));
    }

    /**
     * What the driver is handed beside the folder to sign in by the value.
     */
    private function handover(string $directory): SecretHandover
    {
        return new SecretHandover($this->variables($directory), $this->readFiles($directory));
    }

    /**
     * The file in the account folder that holds the value.
     */
    abstract protected function secretFile(string $directory): string;

    /**
     * The value's file in the private place of the accounts.
     */
    protected function secretPath(string $directory): FilePath
    {
        return $this->files->pathIn(Place::Accounts, $this->secretFile($directory));
    }

    /**
     * The sign-in method this value signs in by.
     */
    abstract protected function method(): SignInMethod;

    /**
     * Lets the driver find the value at start, beside its file.
     */
    abstract protected function install(string $directory): void;

    /**
     * Removes what the sign-in wrote into the account directory.
     */
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
