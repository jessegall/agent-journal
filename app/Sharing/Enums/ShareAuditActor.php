<?php

declare(strict_types=1);

namespace App\Sharing\Enums;

use App\Actors\Exceptions\ActorProviderMissing;
use App\Actors\SystemActor;
use App\Models\Access\User;
use App\Models\Agents\Agent;

/**
 * Who an audit row shows as having acted, as the owner reads it: the owner, the requesting agent, the journal's own
 * system, or an unknown visitor for a public read. Never an address or an identity beyond that.
 */
enum ShareAuditActor: string
{
    case Owner = 'owner';
    case Agent = 'agent';
    case System = 'system';
    case Visitor = 'visitor';

    /**
     * The audit actor an action by an actor of the stored type shows as.
     *
     * @throws ActorProviderMissing
     */
    public static function forStoredType(string $type): self
    {
        return match ($type) {
            User::storedType() => self::Owner,
            Agent::storedType() => self::Agent,
            SystemActor::storedType() => self::System,
            default => throw ActorProviderMissing::forType($type),
        };
    }
}
