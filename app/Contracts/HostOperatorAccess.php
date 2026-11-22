<?php

declare(strict_types=1);

namespace App\Contracts;

/**
 * Whether the actor of this request operates the hosts, so a host instruction is theirs to carry out.
 */
interface HostOperatorAccess
{
    public function isGranted(): bool;
}
