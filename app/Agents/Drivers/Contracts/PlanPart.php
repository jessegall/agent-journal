<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Contracts;

use App\Values\DriverStart;
use App\Values\PlanAddition;

/**
 * A part of a driver's start plan: the files, side sockets, Seatbelt profile or restart file it adds.
 */
interface PlanPart
{
    /**
     * What the part adds to the start's plan.
     */
    public function __invoke(DriverStart $start): PlanAddition;
}
