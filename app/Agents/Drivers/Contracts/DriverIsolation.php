<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Contracts;

use App\Agents\Drivers\Enums\IsolationPlatform;
use App\Agents\Values\BoundaryMechanisms;

/**
 * What one driver's start keeps from the model's tools on each platform, which a recorded run must still show.
 */
interface DriverIsolation
{
    /**
     * The mechanism of each boundary item on the platform.
     */
    public function mechanismsOn(IsolationPlatform $platform): BoundaryMechanisms;
}
