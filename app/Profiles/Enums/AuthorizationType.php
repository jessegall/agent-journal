<?php

declare(strict_types=1);

namespace App\Profiles\Enums;

use App\Actors\Contracts\Authorizer;
use App\Actors\Contracts\Policy;
use App\Actors\Contracts\PolicyCatalogue;
use App\Actors\Support\UnrestrictedAuthorizer;
use App\Profiles\Support\PolicyAuthorizer;
use App\Profiles\Values\AbilityGrant;
use App\Profiles\Values\ProfileAuthorization;
use BackedEnum;

/**
 * How a profile decides what its actors may do: everything, or only the abilities its grants name, through each
 * subject's policy.
 */
enum AuthorizationType: string
{
    case AllowsEverything = 'allows_everything';
    case Policies = 'policies';

    /**
     * The authorizer this strategy gives a profile with these grants.
     */
    public function authorizerFor(ProfileAuthorization $authorization, PolicyCatalogue $catalogue): Authorizer
    {
        return match ($this) {
            self::AllowsEverything => new UnrestrictedAuthorizer(),
            self::Policies => new PolicyAuthorizer($authorization, $catalogue),
        };
    }

    /**
     * Whether these grants hold a class-level ability, the part of a decision that needs no record.
     *
     * @param  list<AbilityGrant>  $grants
     * @param  class-string<Policy>  $policy
     */
    public function grants(array $grants, string $policy, BackedEnum $ability): bool
    {
        return match ($this) {
            self::AllowsEverything => true,
            self::Policies => array_any($grants, fn (AbilityGrant $grant) => $grant->isFor($policy, $ability)),
        };
    }
}
