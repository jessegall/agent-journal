<?php

declare(strict_types=1);

namespace App\Hooks\Drivers\Contracts;

use App\Drivers\Enums\HookDriver;

/**
 * The adapter that reads and answers each supported driver's hook calls.
 */
interface DriverAdapters
{
    public function for(HookDriver $driver): DriverAdapter;
}
