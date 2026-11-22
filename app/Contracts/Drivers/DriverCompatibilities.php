<?php

declare(strict_types=1);

namespace App\Contracts\Drivers;

use App\Support\Compatibility\DriverCompatibility;

/**
 * What start preparation may rely on for each driver the journal runs.
 */
interface DriverCompatibilities
{
    public function for(string $driver): DriverCompatibility;
}
