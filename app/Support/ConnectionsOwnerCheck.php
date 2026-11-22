<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\Actor;
use App\Contracts\Authorization\CurrentAuthorizer;
use App\Contracts\Authorization\VisibilityCheck;
use App\Enums\AccessType;
use App\Models\ProjectInvitation;
use App\Policies\ConnectionsPolicy;

/**
 * Shows the Connect a project window and its actions to an actor who may issue install lines, which only the owner
 * may.
 */
final readonly class ConnectionsOwnerCheck implements VisibilityCheck
{
    public function __construct(private CurrentAuthorizer $authorizer) {}

    public function allows(Actor $actor): bool
    {
        $granted = $this->authorizer->filterActions(
            ConnectionsPolicy::class,
            ProjectInvitation::class,
            [AccessType::Create],
        );

        return $granted !== [];
    }
}
