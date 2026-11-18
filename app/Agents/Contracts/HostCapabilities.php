<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

use App\Agents\Support\HostCapability;
use App\Agents\Support\HostCapabilityQuery;

/**
 * What the recorded evidence says about running a program with an account in an execution mode.
 */
interface HostCapabilities
{
    public function capability(HostCapabilityQuery $query): HostCapability;
}
