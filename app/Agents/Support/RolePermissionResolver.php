<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Agents\Contracts\CurrentSession;
use App\Agents\Enums\AgentRole;
use App\Processes\Contracts\CommandPermissionResolver;
use App\Processes\Models\PermissionRevocation;
use App\Processes\Values\CommandPermissions;

/**
 * Permissions from the session's agent role, narrowed by the revocations of that role; a user or the journal itself is
 * not limited by an agent role. An agent other than the current session's gets the read-only defaults, the narrowest.
 */
final readonly class RolePermissionResolver implements CommandPermissionResolver
{
    public function __construct(private CurrentSession $session, private CurrentActor $actors) {}

    public function forCurrentSession(): CommandPermissions
    {
        return PermissionRevocation::narrow($this->forRole($this->session->isMainAgent() ? AgentRole::MainAgent : AgentRole::ReadOnlyHelper));
    }

    public function forActor(ActorIdentity $actor): CommandPermissions
    {
        if ($actor->type !== ActorType::Agent) {
            return PermissionRevocation::narrow(CommandPermissions::forUser());
        }
        if ($this->isCurrentAgent($actor)) {
            return $this->forCurrentSession();
        }

        return PermissionRevocation::narrow($this->forRole(AgentRole::ReadOnlyHelper));
    }

    private function forRole(AgentRole $role): CommandPermissions
    {
        $source = "role:{$role->value}";

        return $role === AgentRole::MainAgent ? CommandPermissions::forMainAgent($source) : CommandPermissions::forReadOnlyHelper($source);
    }

    private function isCurrentAgent(ActorIdentity $actor): bool
    {
        if (! $this->actors->hasActor()) {
            return false;
        }
        $current = $this->actors->actor();

        return $current->actorType() === ActorType::Agent && $current->actorId() === $actor->id;
    }
}
