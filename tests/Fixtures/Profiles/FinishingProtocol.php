<?php

declare(strict_types=1);

namespace Tests\Fixtures\Profiles;

use App\Profiles\Contracts\SignInProtocol;
use App\Profiles\Support\PrivateAccountProcess;
use App\Profiles\Values\SignInChallenge;
use App\Profiles\Values\SignInVerification;

/**
 * A protocol whose sign-in process ends at once and whose check finds the folder signed in.
 */
final readonly class FinishingProtocol implements SignInProtocol
{
    public function begin(string $directory): PrivateAccountProcess
    {
        return PrivateAccountProcess::start(['/bin/sh', '-c', 'exit 0'], ['PATH' => '/usr/bin:/bin'], $directory);
    }

    public function challengeFrom(PrivateAccountProcess $process): SignInChallenge|null
    {
        return new SignInChallenge('https://example.test/approve', 'CODE-1');
    }

    public function acceptCode(PrivateAccountProcess $process, string $code): void {}

    public function hasFinished(PrivateAccountProcess $process): bool
    {
        return ! $process->isRunning();
    }

    public function verify(string $directory): SignInVerification
    {
        return new SignInVerification(! is_file($directory.'/signed-out'), 'work@example.test');
    }

    public function signOut(string $directory): void
    {
        touch($directory.'/signed-out');
    }
}
