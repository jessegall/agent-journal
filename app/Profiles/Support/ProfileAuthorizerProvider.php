<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\Authorizer;
use App\Actors\Contracts\AuthorizerProvider;
use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\PolicyCatalogue;
use App\Actors\Exceptions\ActorNotAllowed;
use App\Agents\Models\AgentSession;
use App\Profiles\Contracts\ProfileResolver;
use App\Profiles\Exceptions\AgentProfileMissing;
use App\Profiles\Exceptions\ProfileMissing;
use App\Profiles\Exceptions\ProfileRetired;
use App\Profiles\Values\LaunchProfileAuthority;
use App\Profiles\Values\ProfileKey;

/**
 * An agent's authorizer comes from the exact profile revision its launch was pinned to, loaded once when the request
 * was admitted; no class or profile name the agent sends is read.
 */
final readonly class ProfileAuthorizerProvider implements AuthorizerProvider
{
    public function __construct(
        private CurrentActor $actors,
        private ProfileResolver $profiles,
        private PolicyCatalogue $catalogue,
    ) {}

    /**
     * @throws AgentProfileMissing
     */
    public function forActor(Actor $actor): Authorizer
    {
        $authority = $this->actors->authority();

        if (! $authority instanceof LaunchProfileAuthority) {
            throw AgentProfileMissing::forAuthority($authority->description());
        }

        return $authority->profile->authorization->authorizer($this->catalogue);
    }

    /**
     * Another agent's authorizer comes from the profile its live session was pinned to; an agent without a live
     * session, or whose pinned profile is no longer admitted, has none to evaluate.
     *
     * @throws ActorNotAllowed
     */
    public function forTarget(Actor $target): Authorizer
    {
        $session = AgentSession::liveOf($target->actorId())
            ?? throw ActorNotAllowed::withoutStoredAuthority('agent without a live session');

        try {
            $profile = $this->profiles->admittedPin(ProfileKey::from($session->profile_key), $session->profile_revision);
        } catch (ProfileRetired|ProfileMissing) {
            throw ActorNotAllowed::withoutStoredAuthority('agent whose profile is no longer admitted');
        }

        return $profile->authorization->authorizer($this->catalogue);
    }
}
