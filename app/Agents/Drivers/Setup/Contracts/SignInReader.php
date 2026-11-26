<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Setup\Contracts;

use App\Agents\Values\SignInFolder;
use App\Agents\Values\SignInReport;

/**
 * Reads what a driver's sign-in status command printed for an account folder, for the host's sign-in probe (which
 * passes no exit code) and the sign-in runner alike.
 */
interface SignInReader
{
    /**
     * What the sign-in probe printed, read as the account's sign-in report.
     */
    public function __invoke(string $printed, int|null $exitCode, SignInFolder $folder): SignInReport;
}
