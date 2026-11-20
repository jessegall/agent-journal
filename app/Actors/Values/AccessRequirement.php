<?php

declare(strict_types=1);

namespace App\Actors\Values;

use App\Actors\Contracts\CurrentAuthorizer;
use App\Actors\Contracts\Policy;
use App\Operations\Enums\AccessType;

/**
 * One grant a skill or a guidance line needs: an access on a policy, decided on the policy's model class.
 */
final readonly class AccessRequirement
{
    /**
     * @param  class-string<Policy>  $policy
     */
    public function __construct(public string $policy, public AccessType $access) {}

    /**
     * The requirement as written in a stored condition: the policy class and the access.
     */
    public function key(): string
    {
        return $this->policy.':'.$this->access->value;
    }

    /**
     * Whether the calling actor's own profile grants the access; a failing policy throws, never answers no.
     */
    public function isGrantedToCaller(CurrentAuthorizer $authorizer): bool
    {
        return $authorizer->filterActions($this->policy, $this->policy::model(), [$this->access]) !== [];
    }
}
