<?php

declare(strict_types=1);

namespace App\Assignments\Actions;

use App\Assignments\Contracts\AssignmentProviders;
use App\Assignments\Support\AutoAssignmentFact;
use App\Contracts\DomainAvailability;

final readonly class AutoAssignmentAvailability
{
    public function __construct(private AssignmentProviders $providers, private DomainAvailability $domains) {}

    public function allows(AutoAssignmentFact $fact): bool
    {
        $owners = array_unique([
            $this->providers->recordOwner($fact->key->assignableType),
            $this->providers->poolOwner($fact->pool->type),
        ]);
        $actor = $fact->key->actor;

        return array_all($owners, $this->domains->isEnabled(...))
            && $this->providers->activity($actor->type)->mayTakeWork($actor);
    }
}
