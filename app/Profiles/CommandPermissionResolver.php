<?php

declare(strict_types=1);

namespace App\Profiles;

use App\Actors\Contracts\CurrentActor;
use App\Bus\Contracts\CommandPermissionResolver as CommandPermissionResolverContract;
use App\Exceptions\ActorNotAllowed;
use App\Exceptions\ProfileMissing;
use App\Models\Agents\AgentSession;
use App\Models\Profiles\PermissionRevocation;
use App\Sessions\Contracts\ProfileResolver;
use App\Sessions\Exceptions\ProfileRetired;
use App\Sessions\Values\ProcessGrants;
use App\Support\ActorReference;
use App\Values\CommandPermissions;
use App\Values\ProfileKey;
use App\Values\ProfileSnapshot;
use App\Values\StartProfileAuthority;

/**
 * What an actor may run, read from the profile its session was started under: the caller's own pinned profile, or a
 * target's live pin, so a caller's rights never widen another agent's ceiling. Revocations narrow both. An owner or
 * trusted infrastructure acting without a profile runs under no profile ceiling.
 */
final readonly class CommandPermissionResolver implements CommandPermissionResolverContract
{
    public function __construct(
        private CurrentActor $actors,
        private ProfileResolver $profiles,
    ) {}

    public function forCurrentSession(): CommandPermissions
    {
        $authority = $this->actors->authority();

        if (! $authority instanceof StartProfileAuthority) {
            return PermissionRevocation::resolveNarrow(
                CommandPermissions::granted($authority->description(), ProcessGrants::everything()),
            );
        }

        return $this->grantedBy($authority->profile);
    }

    /**
     * @throws ActorNotAllowed
     */
    public function forActor(ActorReference $actor): CommandPermissions
    {
        if ($this->actors->hasActor() && $this->actors->actor()->isSameAs($actor)) {
            return $this->forCurrentSession();
        }

        $session = AgentSession::findLiveOf($actor->id)
            ?? throw ActorNotAllowed::withoutStoredAuthority('actor without a live session');

        try {
            $profile = $this->profiles->admittedPin(
                ProfileKey::from($session->profile_key),
                $session->profile_revision,
            );
        } catch (ProfileRetired|ProfileMissing $cause) {
            throw ActorNotAllowed::withoutStoredAuthority(
                'agent whose profile is no longer admitted',
                previous: $cause,
            );
        }

        return $this->grantedBy($profile);
    }

    private function grantedBy(ProfileSnapshot $profile): CommandPermissions
    {
        $source = "profile:{$profile->key}@{$profile->revision}";

        return PermissionRevocation::resolveNarrow(CommandPermissions::granted($source, $profile->processGrants()));
    }
}
