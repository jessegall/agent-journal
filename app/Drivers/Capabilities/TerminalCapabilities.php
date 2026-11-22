<?php

declare(strict_types=1);

namespace App\Drivers\Capabilities;

use App\Drivers\Contracts\DriverCapabilities;
use App\Drivers\Values\BoundTarget;
use App\Drivers\Values\SupportSnapshot;

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
