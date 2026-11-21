<?php

declare(strict_types=1);

namespace App\Connections\Support;

use App\Actors\Contracts\CurrentAuthorizer;
use App\Agents\Contracts\HostOperatorAccess;
use App\Connections\Models\ProjectInvitation;
use App\Connections\Policies\ConnectionsPolicy;
use App\Operations\Enums\AccessType;

/**
 * An actor who may connect hosts, by issuing install lines, operates them; only the owner may.
 */
final readonly class ConnectionsHostOperatorAccess implements HostOperatorAccess
{
    public function __construct(private CurrentAuthorizer $authorizer) {}

    public function isGranted(): bool
    {
        $granted = $this->authorizer->filterActions(
            ConnectionsPolicy::class,
            ProjectInvitation::class,
            [AccessType::Create],
        );

        return $granted !== [];
    }
}
