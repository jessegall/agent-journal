<?php

declare(strict_types=1);

namespace App\Profiles\Data;

use App\Actors\Contracts\Policy;
use App\Profiles\Values\WithheldAbility;
use Spatie\LaravelData\Data;

/**
 * One withheld ability as a proposal writes it: the policy class and the ability's value.
 */
final class WithheldAbilityData extends Data
{
    /**
     * @param  class-string<Policy>  $policy
     */
    public function __construct(
        public readonly string $policy,
        public readonly string $ability,
    ) {}

    public function toWithheldAbility(): WithheldAbility
    {
        return new WithheldAbility($this->policy, $this->ability);
    }
}
