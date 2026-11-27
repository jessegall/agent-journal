<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Capabilities;

use App\Agents\Drivers\Contracts\DriverCapabilities;
use App\Agents\Drivers\Enums\DriverCapability;
use App\Values\BoundTarget;
use App\Values\OperationSupport;
use App\Values\SupportSnapshot;

/**
 * The Codex terminal driver, which the journal drives from its recorded screens: it does all a driver does but share
 * its account, as it refreshes its own sign-in.
 */
final readonly class CodexTerminalCapabilities implements DriverCapabilities
{
    public const string RUNS_ALONE = 'The Codex terminal refreshes its own sign-in, so it runs alone on its account.';

    public function capabilities(BoundTarget $target): SupportSnapshot
    {
        return SupportSnapshot::allowingAllBut([
            [DriverCapability::SharedAccount, OperationSupport::unsupported(self::RUNS_ALONE)],
        ]);
    }
}
