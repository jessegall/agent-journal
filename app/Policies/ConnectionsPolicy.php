<?php

declare(strict_types=1);

namespace App\Policies;

use App\Contracts\OwnerPolicy;
use App\Models\ProjectInvitation;

/**
 * Who may connect projects from other machines: the owner alone issues and revokes install lines.
 */
final readonly class ConnectionsPolicy implements OwnerPolicy
{
    public static function model(): string
    {
        return ProjectInvitation::class;
    }
}
