<?php

declare(strict_types=1);

namespace App\Values;

use App\Contracts\Authorization\Policy;
use App\Data\Profiles\PolicyGrant;
use App\Enums\Agents\AccessType;

/**
 * One grant a profile withholds from what its base would grant: a policy and an access. A profile only narrows its
 * base this way; it never grants more.
 */
final readonly class WithheldGrant
{
    /**
     * @param  class-string<Policy>  $policy
     */
    public function __construct(public string $policy, public AccessType $access) {}

    public function withholds(PolicyGrant $grant): bool
    {
        return $grant->isFor($this->policy, $this->access);
    }
}
