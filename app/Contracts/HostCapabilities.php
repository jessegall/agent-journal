<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Support\HostCapability;
use App\Support\HostCapabilityQuery;

/**
 * What the recorded evidence says about running a driver with an account in an execution mode.
 */
interface HostCapabilities
{
    public function capability(HostCapabilityQuery $query): HostCapability;
}
