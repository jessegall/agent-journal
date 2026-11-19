<?php

declare(strict_types=1);

namespace App\Actors\Values;

use App\Actors\Contracts\CurrentAuthorizer;
use App\Actors\Contracts\Policy;
use BackedEnum;

/**
 * One ability a skill or a guidance line needs: a policy's ability on its class-level subject, the model class.
 */
final readonly class AbilityRequirement
{
    /**
     * @param  class-string<Policy>  $policy
     * @param  class-string  $subject
     */
    public function __construct(
        public string $policy,
        public string $subject,
        public BackedEnum $ability,
    ) {}

    /**
     * The requirement as written in a stored condition: the policy class and the ability's value.
     */
    public function key(): string
    {
        return $this->policy.':'.$this->ability->value;
    }

    /**
     * Whether the calling actor's own profile grants the ability; a failing policy throws, never answers no.
     */
    public function isGrantedToCaller(CurrentAuthorizer $authorizer): bool
    {
        return $authorizer->filterActions($this->policy, $this->subject, [$this->ability]) !== [];
    }
}
