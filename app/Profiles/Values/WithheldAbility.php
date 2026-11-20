<?php

declare(strict_types=1);

namespace App\Profiles\Values;

use App\Actors\Contracts\Policy;

/**
 * One ability a profile withholds from what its base would grant: the policy and the ability's value, as a proposal
 * writes them. A profile only narrows its base this way; it never grants more.
 */
final readonly class WithheldAbility
{
    /**
     * @param  class-string<Policy>  $policy
     */
    public function __construct(public string $policy, public string $ability) {}

    public function withholds(AbilityGrant $grant): bool
    {
        return $grant->policy === $this->policy && (string) $grant->ability->value === $this->ability;
    }
}
