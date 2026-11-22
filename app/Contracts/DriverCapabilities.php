<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Values\BoundTarget;
use App\Values\SupportSnapshot;

/**
 * Reports what one registered driver can do on a bound host.
 */
interface DriverCapabilities
{
    public function capabilities(BoundTarget $target): SupportSnapshot;
}
