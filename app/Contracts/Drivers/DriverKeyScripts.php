<?php

declare(strict_types=1);

namespace App\Contracts\Drivers;

use App\Support\KeyScripts\KeyScript;

/**
 * The key scripts recorded for a driver's terminal.
 */
interface DriverKeyScripts
{
    /**
     * The driver's key scripts, each ending on the driver's own line saying it applied.
     *
     * @return list<KeyScript>
     */
    public function __invoke(): array;
}
