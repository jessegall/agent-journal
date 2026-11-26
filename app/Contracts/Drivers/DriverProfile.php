<?php

declare(strict_types=1);

namespace App\Contracts\Drivers;

use App\Exceptions\BuildNotPinned;
use App\Exceptions\ProfileRefused;
use App\Support\KeyScripts\KeyScript;
use App\Support\Screens\ScreenLayout;
use App\Values\DriverStart;
use App\Values\HostProcessPlan;

/**
 * How the journal starts and reads one driver's pinned build: the plan of each start, how its terminal is drawn, the
 * key scripts recorded for it and the probe that prints its version.
 */
interface DriverProfile
{
    /**
     * The family of drivers the profile starts, the key its key scripts and screens are recorded under.
     */
    public function family(): string;

    /**
     * The build the journal pins this driver to.
     */
    public function build(): string;

    /**
     * @throws BuildNotPinned
     */
    public function assertPinnedBuild(string $printed): void;

    /**
     * @throws ProfileRefused
     */
    public function startPlan(DriverStart $start): HostProcessPlan;

    /**
     * How the driver's terminal is drawn, as its recorded screens show it.
     */
    public function layout(): ScreenLayout;

    /**
     * @return list<KeyScript>
     */
    public function keyScripts(): array;

    /**
     * The process that prints the driver's version in the folder, which the journal checks against the pinned build.
     */
    public function versionProbe(string $workFolder): HostProcessPlan;

    /**
     * The short process that prints whether the start's account is signed in, in the start's own environment.
     *
     * @throws ProfileRefused
     */
    public function signInProbe(DriverStart $start): HostProcessPlan;

    /**
     * Whether what the sign-in probe printed is a sign-in the journal accepts, kept in the account's own folder.
     */
    public function hasAcceptedSignIn(string $printed, string $accountFolder): bool;

    /**
     * The reader of what one headless turn of the process prints.
     */
    public function turnResult(string $processId): TurnResult;

    /**
     * @param  list<string>  $arguments
     *
     * @throws ProfileRefused
     */
    public function assertNoContraryArgument(array $arguments): void;
}
