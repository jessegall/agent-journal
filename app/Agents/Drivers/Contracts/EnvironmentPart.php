<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Contracts;

use App\Values\DriverStart;
use App\Values\EnvironmentAddition;

/**
 * A part of a driver's environment: the variables, inherited names, folders and read files it adds to a start and to
 * its sign-in probe.
 */
interface EnvironmentPart
{
    /**
     * What the part adds to the start's environment.
     */
    public function __invoke(DriverStart $start): EnvironmentAddition;
}
