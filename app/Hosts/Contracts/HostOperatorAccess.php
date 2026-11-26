<?php

declare(strict_types=1);

namespace App\Hosts\Contracts;

/**
 * Whether the actor of this request operates the hosts, and so may carry out a host instruction.
 */
interface HostOperatorAccess
{
    /**
     * Whether the current actor may operate the host.
     */
    public function isGranted(): bool;
}
