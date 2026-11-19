<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Actors\Values\PolicyRegistration;
use App\Assignments\Enums\AssignmentAbility;
use App\Assignments\Policies\AssignmentPolicy;
use App\Profiles\Enums\AuthorizationType;
use App\Profiles\Enums\ProfileType;
use App\Profiles\Values\AbilityGrant;
use App\Profiles\Values\ProfileAuthorization;

/**
 * The grants of each built-in kind of profile: every ability of every policy registered now, except what only the
 * main agent may do: give work to another actor or let it go.
 */
final class BuiltInAuthorizations
{
    /**
     * @param  list<PolicyRegistration>  $registrations
     */
    public static function for(ProfileType $type, array $registrations = []): ProfileAuthorization
    {
        $grants = [];

        foreach ($registrations as $registration) {
            foreach ($registration->abilities() as $ability) {
                $grants[] = new AbilityGrant($registration->policy, $ability);
            }
        }

        $withheld = self::withheldFrom($type);
        $kept = array_filter($grants, fn (AbilityGrant $grant): bool => ! array_any(
            $withheld,
            fn (AbilityGrant $other): bool => $grant->isFor($other->policy, $other->ability),
        ));

        return new ProfileAuthorization(AuthorizationType::Policies, array_values($kept));
    }

    /**
     * @return list<AbilityGrant>
     */
    private static function withheldFrom(ProfileType $type): array
    {
        $mainAgentOnly = [
            new AbilityGrant(AssignmentPolicy::class, AssignmentAbility::Dispatch),
            new AbilityGrant(AssignmentPolicy::class, AssignmentAbility::Unassign),
        ];

        return match ($type) {
            ProfileType::MainAgent => [],
            ProfileType::WritingHelper, ProfileType::ReadOnlyHelper => $mainAgentOnly,
        };
    }
}
