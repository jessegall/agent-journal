<?php

declare(strict_types=1);

namespace App\Actors\Support;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\Authorizer;
use App\Actors\Contracts\Policy;
use App\Actors\Exceptions\ActorNotAllowed;
use BackedEnum;

/**
 * The authorizer an actor's profile gives it, from the provider its actor type registered.
 */
final readonly class ActorAuthorizers
{
    public function __construct(private AuthorizerProviderRegistry $providers) {}

    public function forActor(Actor $actor): Authorizer
    {
        return $this->providers->get($actor->actorType())->forActor($actor);
    }

    /**
     * The authorizer another actor's own stored source gives it, never the caller's rights.
     */
    public function forTarget(Actor $target): Authorizer
    {
        return $this->providers->get($target->actorType())->forTarget($target);
    }

    /**
     * The abilities of the list the authorizer allows the actor on the subject, in the order given. A refusal here
     * is the answer for that ability, not a failure: filtering actions is asking which are refused.
     *
     * @template TAbility of BackedEnum
     *
     * @param  object|class-string  $subject
     * @param  list<TAbility>  $abilities
     * @return list<TAbility>
     */
    public function allowedAbilities(
        Authorizer $authorizer,
        Policy $policy,
        Actor $actor,
        object|string $subject,
        array $abilities,
    ): array {
        $allowed = [];

        foreach ($abilities as $ability) {
            try {
                $authorizer->authorize($policy, $actor, $subject, $ability);
                $allowed[] = $ability;
            } catch (ActorNotAllowed) {
                continue;
            }
        }

        return $allowed;
    }
}
