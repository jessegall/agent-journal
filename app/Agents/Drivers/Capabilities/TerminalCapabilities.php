<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Capabilities;

use App\Contracts\Drivers\DriverCapabilities;
use App\Values\BoundTarget;
use App\Values\SupportSnapshot;

/**
 * A driver in one persistent terminal: it runs, can be watched and typed into under a lease, and takes key scripts.
 */
final readonly class TerminalCapabilities implements DriverCapabilities
{
    public function capabilities(BoundTarget $target): SupportSnapshot
    {
        return SupportSnapshot::allowingAllBut([]);
    }
}
