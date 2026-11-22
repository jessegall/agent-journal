<?php

declare(strict_types=1);

namespace Tests\Fixtures\Profiles;

use App\Profiles\Values\SignInHosts;
use App\Profiles\Contracts\SignInProtocol;
use App\Profiles\Support\PrivateAccountProcess;
use App\Profiles\Values\SignInChallenge;
use App\Profiles\Values\SignInIdentity;
use App\Profiles\Values\SignInVerification;

/**
 * A sign-in whose program waits for the user far longer than a test runs, so only the journal ending the attempt
 * stops it; any proof it were asked for would sign the folder in.
 */
final readonly class LingeringProtocol implements SignInProtocol
{
    public function signInHosts(): SignInHosts
    {
        return SignInHosts::anthropic();
    }

    public function begin(string $directory): PrivateAccountProcess
    {
        return PrivateAccountProcess::start(['/bin/sh', '-c', 'sleep 30'], ['PATH' => '/usr/bin:/bin'], $directory);
    }

    public function challengeFrom(PrivateAccountProcess $process): SignInChallenge|null
    {
        return null;
    }

    public function canTakeAnswer(): bool
    {
        return true;
    }

    public function acceptCode(PrivateAccountProcess $process, string $code): void {}

    public function hasFinished(PrivateAccountProcess $process): bool
    {
        return ! $process->isRunning();
    }

    public function prove(PrivateAccountProcess $process, string $directory): SignInVerification
    {
        return $this->verify($directory);
    }

    public function verify(string $directory): SignInVerification
    {
        return new SignInVerification(true, SignInIdentity::shown('work@example.test'));
    }

    public function signOut(string $directory): void {}
}
