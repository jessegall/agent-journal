<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Authorization\CurrentAuthorizer;
use App\Contracts\Hosts\HostOperatorAccess;
use App\Enums\AccessType;
use App\Models\ProjectInvitation;
use App\Policies\ConnectionsPolicy;

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
