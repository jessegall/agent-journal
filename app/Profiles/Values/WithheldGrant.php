<?php

declare(strict_types=1);

namespace App\Profiles\Values;

use App\Access\Contracts\Policy;
use App\Agents\Enums\AccessType;
use App\Profiles\Data\PolicyGrant;

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
