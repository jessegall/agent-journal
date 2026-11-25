<?php

declare(strict_types=1);

namespace App\Enums;

use App\Contracts\Authorization\Policy;
use App\Data\Profiles\PolicyGrant;

/**
 * How a profile decides what its actors may do: everything, or only the pairs its grants name.
 */
enum AuthorizationType: string
{
    case AllowsEverything = 'allows_everything';
    case Policies = 'policies';

    /**
     * Whether these grants hold the pair: everything for an unrestricted profile, an exact grant otherwise.
     *
     * @param  list<PolicyGrant>  $grants
     * @param  class-string<Policy>  $policy
     */
    public function grants(array $grants, string $policy, AccessType $access): bool
    {
        return match ($this) {
            self::AllowsEverything => true,
            self::Policies => array_any($grants, fn (PolicyGrant $grant) => $grant->isFor($policy, $access)),
        };
    }
}
