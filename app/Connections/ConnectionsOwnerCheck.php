<?php

declare(strict_types=1);

namespace App\Connections;

use App\Access\Contracts\VisibilityCheck;
use App\Actors\Contracts\Actor;
use App\Hosts\Contracts\HostOperatorAccess;

/**
 * Shows the Connect a project window and its actions to an actor who may issue install lines, which only the owner
 * may.
 */
final readonly class ConnectionsOwnerCheck implements VisibilityCheck
{
    public function __construct(private HostOperatorAccess $access) {}

    public function allows(Actor $actor): bool
    {
        return $this->access->isGranted();
    }
}
