<?php

declare(strict_types=1);

namespace Domain\Access\Policies;

use App\Contracts\OwnerPolicy;
use Domain\Access\Models\EnvironmentUserGrant;

/**
 * Who may admit users to an environment's chats, revoke them and disable accounts: only the owner holds the access.
 */
final readonly class EnvironmentAccessPolicy implements OwnerPolicy
{
    public static function model(): string
    {
        return EnvironmentUserGrant::class;
    }
}
