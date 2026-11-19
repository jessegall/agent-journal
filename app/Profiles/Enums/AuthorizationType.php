<?php

declare(strict_types=1);

namespace App\Profiles\Enums;

use App\Actors\Contracts\Authorizer;
use App\Actors\Support\AllowsEverything;
use App\Profiles\Support\PolicyAuthorizer;
use App\Profiles\Values\ProfileAuthorization;

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
    public function authorizerFor(ProfileAuthorization $authorization): Authorizer
    {
        return match ($this) {
            self::AllowsEverything => new AllowsEverything(),
            self::Policies => new PolicyAuthorizer($authorization),
        };
    }
}
