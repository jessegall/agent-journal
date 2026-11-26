<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Contracts;

use App\Support\Compatibility\DriverCompatibility;

/**
 * What start preparation may rely on for each driver the journal runs.
 */
interface DriverCompatibilities
{
    /**
     * What the installed version of the driver understands, such as the settings it reads.
     */
    public function for(string $driver): DriverCompatibility;
}
