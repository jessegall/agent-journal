<?php

declare(strict_types=1);

namespace App\Contracts\Hosts;

use App\Support\HostCapability;
use App\Support\HostCapabilityQuery;

/**
 * What the recorded evidence says about running a driver with an account in an execution mode.
 */
interface HostCapabilities
{
    /**
     * Whether the host can do what the query asks, and why not when it cannot.
     */
    public function capability(HostCapabilityQuery $query): HostCapability;
}
