<?php

declare(strict_types=1);

namespace Tests\Fixtures\Drivers;

use App\Contracts\Drivers\DriverCapabilities;
use App\Enums\Drivers\DriverCapability;
use App\Values\BoundTarget;
use App\Values\OperationSupport;
use App\Values\SupportSnapshot;

/**
 * A test driver that refreshes its own sign-in, so it runs alone on its account.
 */
final readonly class RunsAloneCapabilities implements DriverCapabilities
{
    public const string RUNS_ALONE = 'The test driver refreshes its own sign-in.';

    public function capabilities(BoundTarget $target): SupportSnapshot
    {
        return SupportSnapshot::allowingAllBut([
            [DriverCapability::SharedAccount, OperationSupport::unsupported(self::RUNS_ALONE)],
        ]);
    }
}
