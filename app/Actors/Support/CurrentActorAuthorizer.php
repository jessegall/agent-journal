<?php

declare(strict_types=1);

namespace App\Actors\Support;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\CurrentAuthorizer;
use App\Actors\Contracts\Policy;
use BackedEnum;
use Illuminate\Contracts\Container\Container;

/**
 * Authorization for the actor of this request: the authorizer its type's provider gives it, asked with the policy the
 * container builds. It is bound per request, so nothing it resolves outlives the request.
 */
final readonly class CurrentActorAuthorizer implements CurrentAuthorizer
{
    public function __construct(
        private CurrentActor $actors,
        private ActorAuthorizers $authorizers,
        private Container $container,
    ) {}

    /**
     * @param  class-string<Policy>  $policy
     * @param  object|class-string  $subject
     */
    public function authorize(string $policy, object|string $subject, BackedEnum $ability): void
    {
        $actor = $this->actors->actor();
        $this->authorizers->forActor($actor)->authorize($this->container->make($policy), $actor, $subject, $ability);
    }

    /**
     * @template TAbility of BackedEnum
     *
     * @param  class-string<Policy>  $policy
     * @param  object|class-string  $subject
     * @param  list<TAbility>  $abilities
     * @return list<TAbility>
     */
    public function filterActions(string $policy, object|string $subject, array $abilities): array
    {
        $actor = $this->actors->actor();
        $authorizer = $this->authorizers->forActor($actor);

        $made = $this->container->make($policy);

        return $this->authorizers->allowedAbilities($authorizer, $made, $actor, $subject, $abilities);
    }
}
