<?php

declare(strict_types=1);

namespace App\Profiles\Contracts;

use App\Profiles\Support\PrivateAccountProcess;
use App\Profiles\Values\SignInChallenge;
use App\Profiles\Values\SignInVerification;

/**
 * One program's own sign-in on the host, run against a private account folder: start it, and check afterwards
 * whether the folder is signed in. The challenge it shows goes only to the person, never through this contract.
 */
interface SignInProtocol
{
    /**
     * Starts the program's sign-in for the folder and answers its private process.
     */
    public function begin(string $directory): PrivateAccountProcess;

    /**
     * What the person needs to approve the sign-in, once the program printed it; none before.
     */
    public function challengeFrom(PrivateAccountProcess $process): SignInChallenge|null;

    /**
     * Gives the program the code the person typed, for a sign-in that asks for one; others ignore it.
     */
    public function acceptCode(PrivateAccountProcess $process, string $code): void;

    /**
     * Whether the program's sign-in is over, approved or not; a process that serves on after it says so itself.
     */
    public function hasFinished(PrivateAccountProcess $process): bool;

    /**
     * The program's own check of the folder, run after its sign-in process ended.
     */
    public function verify(string $directory): SignInVerification;
}
