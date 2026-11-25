<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\AuthorizationType;
use App\Values\PolicyDefinition;
use App\Values\PolicyGrant;
use App\Values\ProfileAuthorization;
use App\Values\ProfileBase;
use App\Values\ScopedRead;

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
                $grants[] = new PolicyGrant($definition->policy, $access);
            }
        }

        $orientation = array_map(fn (string $read) => new ScopedRead($read), self::ORIENTATION_READS);

        return new ProfileAuthorization(AuthorizationType::Policies, $grants, [], $orientation);
    }
}
