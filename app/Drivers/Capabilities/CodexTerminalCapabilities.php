<?php

declare(strict_types=1);

namespace App\Drivers\Capabilities;

use App\Drivers\Contracts\DriverCapabilities;
use App\Drivers\Enums\DriverCapability;
use App\Drivers\Values\BoundTarget;
use App\Drivers\Values\OperationSupport;
use App\Drivers\Values\SupportSnapshot;

/**
 * The Codex terminal driver, which no host runs yet: every operation waits until its terminal is proven on a host.
 */
final readonly class CodexTerminalCapabilities implements DriverCapabilities
{
    public const string NOT_PROVEN = 'The Codex terminal is not proven on any host yet; use Codex headless meanwhile.';

    public function capabilities(BoundTarget $target): SupportSnapshot
    {
        return SupportSnapshot::allowingAllBut(array_map(
            fn (DriverCapability $capability) => [$capability, OperationSupport::unavailable(self::NOT_PROVEN)],
            DriverCapability::cases(),
        ));
    }
}
