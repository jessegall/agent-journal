<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Contracts;

use App\Terminals\KeyScripts\KeyScript;

/**
 * One key script recorded for a driver's terminal, ending on the driver's own line saying it applied; a driver's setup
 * lists the class of each of its scripts.
 */
interface DriverKeyScript
{
    /**
     * The script, for the driver build it was recorded on.
     */
    public function __invoke(): KeyScript;
}
