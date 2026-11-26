<?php

declare(strict_types=1);

namespace App\Support\Capabilities;

use App\Contracts\Drivers\DriverCapabilities;
use App\Enums\Drivers\DriverCapability;
use App\Values\BoundTarget;
use App\Values\OperationSupport;
use App\Values\SupportSnapshot;

/**
 * The Codex terminal driver, which the journal drives from its recorded screens: it does all a driver does but share
 * its account, as it refreshes its own sign-in, or run in a container, whose sign-in its tools could read.
 */
final readonly class CodexTerminalCapabilities implements DriverCapabilities
{
    public const string RUNS_ALONE = 'The Codex terminal refreshes its own sign-in, so it runs alone on its account.';

    public function capabilities(BoundTarget $target): SupportSnapshot
    {
        return SupportSnapshot::allowingAllBut([
            [
                DriverCapability::SharedAccount,
                OperationSupport::unsupported(self::RUNS_ALONE),
            ],
            [
                DriverCapability::RunContained,
                OperationSupport::unsupported(CodexHeadlessCapabilities::NOT_CONTAINABLE),
            ],
        ]);
    }
}
