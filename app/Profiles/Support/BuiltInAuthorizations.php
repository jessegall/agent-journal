<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Actors\Values\PolicyRegistration;
use App\Profiles\Enums\AuthorizationType;
use App\Profiles\Values\AbilityGrant;
use App\Profiles\Values\ProfileAuthorization;
use App\Profiles\Values\ProfileBase;

/**
 * The grants of each built-in kind of profile: the abilities every policy registered now gives agents, as each
 * registration names what only the owner, or only a coordinating profile, may do.
 */
final class BuiltInAuthorizations
{
    /**
     * @param  list<PolicyRegistration>  $registrations
     */
    public static function for(ProfileBase $type, array $registrations = []): ProfileAuthorization
    {
        $grants = [];

        foreach ($registrations as $registration) {
            foreach ($registration->abilitiesForAgents($type->isCoordinator()) as $ability) {
                $grants[] = new AbilityGrant($registration->policy, $ability);
            }
        }

        return new ProfileAuthorization(AuthorizationType::Policies, $grants);
    }
}
