<?php

declare(strict_types=1);

namespace App\Hosts;

use App\Access\Contracts\CurrentAuthorizer;
use App\Agents\Enums\AccessType;
use App\Hosts\Contracts\HostOperatorAccess as HostOperatorAccessContract;
use App\Models\Projects\ProjectInvitation;
use App\Policies\ConnectionsPolicy;

/**
 * An actor who may connect hosts, by issuing install lines, operates them; only the owner may.
 */
final readonly class HostOperatorAccess implements HostOperatorAccessContract
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
