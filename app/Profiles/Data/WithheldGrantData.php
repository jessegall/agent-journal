<?php

declare(strict_types=1);

namespace App\Profiles\Data;

use App\Actors\Contracts\Policy;
use App\Operations\Enums\AccessType;
use App\Profiles\Values\WithheldGrant;
use Spatie\LaravelData\Data;

/**
 * One withheld grant as a proposal writes it: the policy class and the access.
 */
final class WithheldGrantData extends Data
{
    /**
     * @param  class-string<Policy>  $policy
     */
    public function __construct(
        public readonly string $policy,
        public readonly AccessType $access,
    ) {}

    public function toWithheldGrant(): WithheldGrant
    {
        return new WithheldGrant($this->policy, $this->access);
    }
}
