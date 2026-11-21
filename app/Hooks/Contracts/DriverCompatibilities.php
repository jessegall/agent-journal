<?php

declare(strict_types=1);

namespace App\Hooks\Contracts;

use App\Drivers\Enums\HookDriver;
use App\Hooks\Support\DriverCompatibility;

/**
 * What start preparation may rely on for each program the journal runs.
 */
interface DriverCompatibilities
{
    public function for(HookDriver $driver): DriverCompatibility;
}
