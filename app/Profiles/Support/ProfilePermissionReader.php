<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Exceptions\ActorNotAllowed;
use App\Actors\Support\ActorIdentity;
use App\Agents\Models\AgentSession;
use App\Processes\Contracts\CommandPermissionResolver;
use App\Processes\Models\PermissionRevocation;
use App\Processes\Values\CommandPermissions;
use App\Processes\Values\ProcessGrants;
use App\Profiles\Contracts\ProfileResolver;
use App\Profiles\Exceptions\ProfileMissing;
use App\Profiles\Exceptions\ProfileRetired;
use App\Profiles\Values\LaunchProfileAuthority;
use App\Profiles\Values\ProfileKey;
use App\Profiles\Values\ProfileSnapshot;

/**
 * What an actor may run, read from the profile its session was launched under: the caller's own pinned profile, or a
 * target's live pin, so a caller's rights never widen another agent's ceiling. Revocations narrow both. An owner or
 * trusted infrastructure acting without a profile runs under no profile ceiling.
 */
final readonly class ProfilePermissionReader implements CommandPermissionResolver
{
    public function __construct(
        private CurrentActor $actors,
        private ProfileResolver $profiles,
    ) {}

    public function forCurrentSession(): CommandPermissions
    {
        $authority = $this->actors->authority();

        if (! $authority instanceof LaunchProfileAuthority) {
            return PermissionRevocation::narrow(
                CommandPermissions::granted($authority->description(), ProcessGrants::everything()),
            );
        }

        return $this->grantedBy($authority->profile);
    }

    /**
     * @throws ActorNotAllowed
     */
    public function forActor(ActorIdentity $actor): CommandPermissions
    {
        if ($this->actors->hasActor() && ActorIdentity::of($this->actors->actor())->isSameAs($actor)) {
            return $this->forCurrentSession();
        }

        $session = AgentSession::liveOf($actor->id)
            ?? throw ActorNotAllowed::withoutStoredAuthority('actor without a live session');

        try {
            $profile = $this->profiles->admittedPin(ProfileKey::from($session->profile_key), $session->profile_revision);
        } catch (ProfileRetired|ProfileMissing) {
            throw ActorNotAllowed::withoutStoredAuthority('agent whose profile is no longer admitted');
        }

        return $this->grantedBy($profile);
    }

    private function grantedBy(ProfileSnapshot $profile): CommandPermissions
    {
        $source = "profile:{$profile->key}@{$profile->revision}";

        return PermissionRevocation::narrow(CommandPermissions::granted($source, $profile->processGrants()));
    }
}
