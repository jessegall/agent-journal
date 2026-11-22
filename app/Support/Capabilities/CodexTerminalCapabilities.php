<?php

declare(strict_types=1);

namespace App\Support\Capabilities;

use App\Contracts\DriverCapabilities;
use App\Enums\DriverCapability;
use App\Values\BoundTarget;
use App\Values\OperationSupport;
use App\Values\SupportSnapshot;

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
