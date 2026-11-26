<?php

declare(strict_types=1);

namespace App\Agents;

use App\Access\Contracts\CurrentAuthorizer;
use App\Access\Contracts\VisibilityCheck;
use App\Actors\Contracts\Actor;
use App\Agents\Enums\AccessType;
use App\Models\Agents\ActivityEntry;
use App\Policies\ActivityPolicy;

/**
 * Shows the Activity window to an actor who may read what the agents did.
 */
final readonly class ActivityOwnerCheck implements VisibilityCheck
{
    public function __construct(private CurrentAuthorizer $authorizer) {}

    public function allows(Actor $actor): bool
    {
        return $this->authorizer->filterActions(ActivityPolicy::class, ActivityEntry::class, [AccessType::Read]) !== [];
    }
}
