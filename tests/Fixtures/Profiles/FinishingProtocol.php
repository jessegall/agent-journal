<?php

declare(strict_types=1);

namespace Tests\Fixtures\Profiles;

use App\Profiles\Contracts\SignInProtocol;
use App\Profiles\Support\PrivateAccountProcess;
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

    public function hasFinished(PrivateAccountProcess $process): bool
    {
        return ! $process->isRunning();
    }

    public function verify(string $directory): SignInVerification
    {
        return new SignInVerification(true, 'work@example.test');
    }
}
