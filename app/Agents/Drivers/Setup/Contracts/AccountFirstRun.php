<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Setup\Contracts;

use App\Values\FilePath;

/**
 * Answers a driver's first-run questions once for an account folder that is signed in.
 */
interface AccountFirstRun
{
    /**
     * Settles the driver's first-run state in the account folder, so its first-run screen never shows.
     */
    public function __invoke(FilePath $accountFolder): void;
}
