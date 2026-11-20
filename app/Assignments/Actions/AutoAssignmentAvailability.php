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
        return $this->domainsEnabled($fact) && $this->isActive($fact);
    }

    public function domainsEnabled(AutoAssignmentFact $fact): bool
    {
        $owners = array_unique([
            $this->providers->recordOwner($fact->key->assignableType),
            $this->providers->poolOwner($fact->pool->type),
        ]);

        return array_all($owners, fn (string $owner): bool => $this->domains->isEnabled($owner));
    }

    public function isActive(AutoAssignmentFact $fact): bool
    {
        $actor = $fact->key->actor;

        return $this->providers->activity($actor->type)->mayTakeWork($actor);
    }
}
