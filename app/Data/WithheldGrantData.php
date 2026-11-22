<?php

declare(strict_types=1);

namespace App\Data;

use App\Contracts\Authorization\Policy;
use App\Enums\AccessType;
use App\Values\WithheldGrant;
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
