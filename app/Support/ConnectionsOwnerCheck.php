<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\Actor;
use App\Contracts\Authorization\VisibilityCheck;
use App\Contracts\Hosts\HostOperatorAccess;

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
