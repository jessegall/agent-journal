<?php

declare(strict_types=1);

namespace App\Agents\Exceptions;

use App\Agents\Enums\AgentRole;
use App\Contracts\CommandRefusal;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use InvalidArgumentException;

/**
 * An access policy that grants what no policy may: a protected resource, or more than its role's ceiling.
 */
final class AccessPolicyInvalid extends InvalidArgumentException implements CommandRefusal
{
    public static function protectedGrant(AgentRole $role): self
    {
        return new self("A {$role->name} policy grants protected resources, which no policy may grant.");
    }

    public static function aboveCeiling(AgentRole $role, AccessType $access, ResourceAreaType $area): self
    {
        return new self("A {$role->name} policy cannot grant {$access->value} on {$area->value}: a profile that changes workspace files must be a writing helper.");
    }
}
