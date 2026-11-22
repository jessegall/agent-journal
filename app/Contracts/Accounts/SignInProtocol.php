<?php

declare(strict_types=1);

namespace App\Contracts\Accounts;

use App\Support\PrivateAccountProcess;
use App\Values\SignInCard;
use App\Values\SignInChallenge;
use App\Values\SignInHosts;
use App\Values\SignInVerification;

/**
 * One driver's own sign-in on the host, run against a private account folder: start it, and check afterwards
 * whether the folder is signed in. The challenge it shows goes only to the user, never through this contract.
 */
interface SignInProtocol
{
    /**
     * What the method's card says about this sign-in, in the driver's own words.
     */
    public function card(): SignInCard;

    /**
     * The provider hosts this sign-in's pages live on, the only links a sign-in shows the user.
     */
    public function signInHosts(): SignInHosts;

    /**
     * Starts the driver's sign-in for the folder and answers its private process.
     */
    public function begin(string $directory): PrivateAccountProcess;

    /**
     * What the user needs to approve the sign-in, once the driver printed it; none before.
     */
    public function challengeFrom(PrivateAccountProcess $process): SignInChallenge|null;

    /**
     * Whether the sign-in asks the user for an answer, a code or a key; one approved on the provider's page takes none.
     */
    public function canTakeAnswer(): bool;

    /**
     * Gives the driver the code the user typed, for a sign-in that asks for one; others ignore it.
     */
    public function acceptCode(PrivateAccountProcess $process, string $code): void;

    /**
     * Whether the driver's sign-in is over, approved or not; a process that serves on after it says so itself.
     */
    public function hasFinished(PrivateAccountProcess $process): bool;

    /**
     * The driver's own proof that the sign-in it just ran succeeded in this folder, asked while its process is
     * still open.
     */
    public function prove(PrivateAccountProcess $process, string $directory): SignInVerification;

    /**
     * The driver's plain status check of the folder, for account checks and cleanup.
     */
    public function verify(string $directory): SignInVerification;

    /**
     * Signs the folder's account out with the driver's own command, so its sign-in store forgets it.
     */
    public function signOut(string $directory): void;
}
