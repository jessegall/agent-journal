<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Contracts;

use App\Values\BoundTarget;
use App\Values\SupportSnapshot;

/**
 * Reports what one registered driver can do on a bound host.
 */
interface DriverCapabilities
{
    /**
     * What the driver supports for the bound target, such as rewriting a command or passing a screen.
     */
    public function capabilities(BoundTarget $target): SupportSnapshot;
}
