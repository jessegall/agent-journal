<?php

declare(strict_types=1);

namespace App\Profiles;

use App\Access\Contracts\Authorizer;
use App\Access\Contracts\AuthorizerProvider;
use App\Access\Contracts\PolicyCatalogue;
use App\Access\PolicyAuthorizer;
use App\Access\UnrestrictedAuthorizer;
use App\Actors\Contracts\Actor;
use App\Actors\Contracts\CurrentActor;
use App\Exceptions\ActorNotAllowed;
use App\Exceptions\ProfileMissing;
use App\Models\Agents\AgentSession;
use App\Profiles\Data\ProfileAuthorization;
use App\Profiles\Enums\AuthorizationType;
use App\Profiles\Exceptions\AgentProfileMissing;
use App\Reflection\Contracts\ReflectorFactory;
use App\Sessions\Contracts\ProfileResolver;
use App\Sessions\Exceptions\ProfileRetired;
use App\Values\ProfileKey;
use App\Values\StartProfileAuthority;
use Illuminate\Contracts\Auth\Access\Gate;

/**
 * An agent's authorizer comes from the exact profile revision its start was pinned to, loaded once when the request
 * was admitted; no class or profile name the agent sends is read.
 */
final readonly class ProfileAuthorizerProvider implements AuthorizerProvider
{
    public function __construct(
        private CurrentActor $actors,
        private ProfileResolver $profiles,
        private PolicyCatalogue $catalogue,
        private Gate $gate,
        private ReflectorFactory $reflectors,
    ) {}

    /**
     * @throws AgentProfileMissing
     */
    public function forActor(Actor $actor): Authorizer
    {
        $authority = $this->actors->authority();

        if (! $authority instanceof StartProfileAuthority) {
            throw AgentProfileMissing::forAuthority($authority->description());
        }

        return $this->authorizerOf($authority->profile->authorization);
    }

    /**
     * Another agent's authorizer comes from the profile its live session was pinned to; an agent without a live
     * session, or whose pinned profile is no longer admitted, has none to evaluate.
     *
     * @throws ActorNotAllowed
     */
    public function forTarget(Actor $target): Authorizer
    {
        $session = AgentSession::findLiveOf($target->actorId())
            ?? throw ActorNotAllowed::withoutStoredAuthority('agent without a live session');

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

        return $this->authorizerOf($profile->authorization);
    }

    /**
     * The strategy a frozen profile's authorization asks for: everything, or its pairs through the policies.
     */
    private function authorizerOf(ProfileAuthorization $authorization): Authorizer
    {
        return match ($authorization->type) {
            AuthorizationType::AllowsEverything => new UnrestrictedAuthorizer(),
            AuthorizationType::Policies => new PolicyAuthorizer(
                $authorization,
                $this->catalogue,
                $this->gate,
                $this->reflectors,
            ),
        };
    }
}
