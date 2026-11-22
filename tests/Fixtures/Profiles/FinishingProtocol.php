<?php

declare(strict_types=1);

namespace Tests\Fixtures\Profiles;

use App\Values\SignInCard;
use App\Values\SignInHosts;
use App\Contracts\Accounts\SignInProtocol;
use App\Support\PrivateAccountProcess;
use App\Values\SignInChallenge;
use App\Values\SignInIdentity;
use App\Values\SignInVerification;

/**
 * A protocol whose sign-in process ends at once and whose check finds the folder signed in.
 */
final readonly class FinishingProtocol implements SignInProtocol
{
    public function signInHosts(): SignInHosts
    {
        return SignInHosts::anthropic();
    }

    public function card(): SignInCard
    {
        return new SignInCard('Test sign-in', 'A sign-in the tests drive.', 'Nothing is billed.', null);
    }

    public function begin(string $directory): PrivateAccountProcess
    {
        return PrivateAccountProcess::start(['/bin/sh', '-c', 'exit 0'], ['PATH' => '/usr/bin:/bin'], $directory);
    }

    public function challengeFrom(PrivateAccountProcess $process): SignInChallenge
    {
        return new SignInChallenge('https://example.test/approve', 'CODE-1');
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
        $identity = new SignInIdentity('work@example.test', 'subject-1', 'workspace-1');

        return new SignInVerification(! is_file($directory.'/signed-out'), $identity);
    }

    public function signOut(string $directory): void
    {
        touch($directory.'/signed-out');
    }
}
