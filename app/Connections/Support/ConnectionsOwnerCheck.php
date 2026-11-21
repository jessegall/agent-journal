<?php

declare(strict_types=1);

namespace App\Connections\Support;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\CurrentAuthorizer;
use App\Connections\Models\ProjectInvitation;
use App\Connections\Policies\ConnectionsPolicy;
use App\Operations\Enums\AccessType;
use App\Ui\Contracts\VisibilityCheck;

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
