<?php

declare(strict_types=1);

namespace App\Policies;

use App\Contracts\Authorization\OwnerPolicy;
use App\Models\Access\EnvironmentUserGrant;

/**
 * Who may admit users to an environment's inboxes, revoke them and disable accounts: only the owner holds the access.
 */
final readonly class EnvironmentAccessPolicy implements OwnerPolicy
{
    public static function model(): string
    {
        return EnvironmentUserGrant::class;
    }
}
