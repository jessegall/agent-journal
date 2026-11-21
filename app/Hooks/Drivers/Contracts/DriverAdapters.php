<?php

declare(strict_types=1);

namespace App\Hooks\Drivers\Contracts;

use App\Drivers\Enums\HookDriver;
use App\Hooks\Drivers\Contracts\DriverAdapter;

/**
 * The adapter that reads and answers each supported program's hook calls.
 */
interface DriverAdapters
{
    public function for(HookDriver $driver): DriverAdapter;
}
