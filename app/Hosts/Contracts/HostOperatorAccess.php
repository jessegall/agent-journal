<?php

declare(strict_types=1);

namespace App\Hosts\Contracts;

/**
 * Whether the actor of this request operates the hosts, so a host instruction is theirs to carry out.
 */
interface HostOperatorAccess
{
    /**
     * Whether the current actor may operate the host.
     */
    public function isGranted(): bool;
}
