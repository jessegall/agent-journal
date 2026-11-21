<?php

declare(strict_types=1);

namespace App\Actors\Contracts;

use App\Operations\Enums\AccessType;
use App\Operations\Enums\ProfileAudience;

/**
 * A policy that narrows who is granted some of its accesses beyond what each access type says.
 */
interface RestrictedPolicy extends Policy
{
    /**
     * Which built-in agent profiles may also be granted this access of the policy, on top of the access's own audience.
     */
    public static function additionalAudience(AccessType $access): ProfileAudience;
}
