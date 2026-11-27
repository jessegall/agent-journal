<?php

declare(strict_types=1);

namespace App\Profiles;

use App\Access\Values\PolicyDefinition;
use App\Profiles\Data\PolicyGrant;
use App\Profiles\Data\ProfileAuthorization;
use App\Profiles\Data\ScopedRead;
use App\Profiles\Enums\AuthorizationType;
use App\Values\ProfileBase;

/**
 * The grants of each built-in kind of profile: every pair a registered policy accepts, its definition's owner,
 * coordinator and read-only restrictions permit for the base, and the base's own access list includes.
 */
final class BuiltInAuthorizations
{
    /**
     * The reads every built-in profile holds by name: the caller's own session and the operations it may run.
     */
    public const array ORIENTATION_READS = [
        'overview_read',
        'capabilities_read',
        'operations_read',
    ];

    /**
     * @param  list<PolicyDefinition>  $definitions
     */
    public static function for(ProfileBase $type, array $definitions = []): ProfileAuthorization
    {
        $grants = [];

        foreach ($definitions as $definition) {
            $granted = $definition->grantsForAgents($type->isCoordinator(), $type->isReadOnly());

            foreach (array_filter($granted, $type->allows(...)) as $access) {
                $grants[] = PolicyGrant::from(['policy' => $definition->policy, 'access' => $access]);
            }
        }

        $orientation = array_map(fn (string $read) => ScopedRead::from(['name' => $read]), self::ORIENTATION_READS);

        return ProfileAuthorization::from(['type' => AuthorizationType::Policies, 'grants' => $grants, 'denied_commands' => [], 'reads' => $orientation]);
    }
}
