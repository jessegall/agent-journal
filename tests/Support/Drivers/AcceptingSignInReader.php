<?php

declare(strict_types=1);

namespace Tests\Support\Drivers;

use App\Accounts\Enums\SignInMethod;
use App\Agents\Drivers\Setup\Contracts\SignInReader;
use App\Agents\Values\SignInFolder;
use App\Agents\Values\SignInReport;

/**
 * A sign-in reader that finds every folder signed in, as a test swaps it for a driver's own.
 */
final readonly class AcceptingSignInReader implements SignInReader
{
    public function __invoke(string $printed, int|null $exitCode, SignInFolder $folder): SignInReport
    {
        return new SignInReport(true, true, SignInMethod::OAuth);
    }
}
