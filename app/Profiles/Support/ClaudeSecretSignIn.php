<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Files\Contracts\Files;
use App\Files\Enums\Permissions;
use App\Files\Enums\Place;
use App\Files\Exceptions\FileExists;
use App\Files\Exceptions\FileUnwritable;
use App\Files\Values\FilePath;
use App\Profiles\Contracts\SignInProtocol;
use App\Profiles\Exceptions\SignInSecretUnwritable;
use App\Profiles\Values\SignInChallenge;
use App\Profiles\Values\SignInIdentity;
use App\Profiles\Values\SignInVerification;

/**
 * A Claude Code sign-in by a value the owner gives: no driver runs until the value arrives, then it is written to a
 * private file in the account folder, which the driver reads at every launch, never through its arguments or its
 * environment. The status names the method, and one short model call proves the value works.
 */
abstract readonly class ClaudeSecretSignIn implements SignInProtocol
{
    public function __construct(protected ClaudeDriver $claude, protected Files $files) {}

    public function begin(string $directory): PrivateAccountProcess
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

    public function prove(PrivateAccountProcess $process, string $directory): SignInVerification
    {
        $verification = $this->verify($directory);

        if (! $verification->isSignedIn) {
            return $verification;
        }

        $refusal = $this->claude->modelRefusal($directory, $this->variables($directory), $this->readFiles($directory));

        return $refusal === null ? $verification : SignInVerification::refused($refusal);
    }

    /**
     * Signed in when the value's file is there and the status names this method in this folder; another method,
     * such as a claude.ai login found in the folder, is the wrong one.
     */
    public function verify(string $directory): SignInVerification
    {
        if (! $this->files->exists($this->secretPath($directory))) {
            return new SignInVerification(false, SignInIdentity::unproved());
        }

        $status = $this->claude->status($directory, $this->variables($directory), $this->readFiles($directory));
        $isSignedIn = $status->isSignedInBy($this->authMethod(), $directory, $this->realFolder($directory));
        $identity = $isSignedIn ? new SignInIdentity(null, null, null, $status->expiresAt) : SignInIdentity::unproved();

        return new SignInVerification($isSignedIn, $identity, $status->isReadable);
    }

    public function signOut(string $directory): void
    {
        $this->uninstall($directory);

        $this->files->delete($this->secretPath($directory));
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
     * The account folder's real path, which the driver may report instead of the path it was given.
     */
    protected function realFolder(string $directory): string
    {
        return $this->files->realPath($this->files->pathIn(Place::Accounts, $directory));
    }

    /**
     * The authMethod the status prints for this method.
     */
    abstract protected function authMethod(): string;

    /**
     * Lets the driver find the value at launch, beside its file.
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
