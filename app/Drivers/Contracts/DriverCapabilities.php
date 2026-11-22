<?php

declare(strict_types=1);

namespace App\Drivers\Contracts;

use App\Drivers\Values\BoundTarget;
use App\Drivers\Values\SupportSnapshot;

/**
 * Reports what one registered driver can do on a bound host.
 */
interface DriverCapabilities
{
    public function capabilities(BoundTarget $target): SupportSnapshot;
}
