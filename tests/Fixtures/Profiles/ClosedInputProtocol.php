<?php

declare(strict_types=1);

namespace Tests\Fixtures\Profiles;

use App\Values\SignInHosts;
use App\Contracts\SignInProtocol;
use App\Support\PrivateAccountProcess;
use App\Values\SignInChallenge;
use App\Values\SignInIdentity;
use App\Values\SignInVerification;

/**
 * A sign-in whose program closed its input before the user's answer came, so handing the answer to it breaks; any
 * proof it were asked for would sign the folder in.
 */
final readonly class ClosedInputProtocol implements SignInProtocol
{
    public function signInHosts(): SignInHosts
    {
        return SignInHosts::anthropic();
    }

    public function begin(string $directory): PrivateAccountProcess
    {
        return PrivateAccountProcess::start(['/bin/sh', '-c', 'exec 0<&-; sleep 30'], ['PATH' => '/usr/bin:/bin'], $directory);
    }

    public function challengeFrom(PrivateAccountProcess $process): SignInChallenge|null
    {
        return null;
    }

    public function canTakeAnswer(): bool
    {
        return true;
    }

    public function acceptCode(PrivateAccountProcess $process, string $code): void
    {
        usleep(100_000);
        $process->send(str_repeat($code, 20_000));
    }

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
