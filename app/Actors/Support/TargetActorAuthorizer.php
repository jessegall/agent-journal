<?php

declare(strict_types=1);

namespace App\Actors\Support;

use App\Actors\Contracts\ActorResolver;
use App\Actors\Contracts\Policy;
use App\Actors\Contracts\TargetAuthorizer;
use BackedEnum;
use Illuminate\Contracts\Container\Container;

/**
 * Asks the target actor's own provider, chosen by the target's type through the registry; each evaluation stands
 * alone, so one target's refusal never changes the next one's answer.
 */
final readonly class TargetActorAuthorizer implements TargetAuthorizer
{
    public function __construct(
        private ActorResolver $actors,
        private ActorAuthorizers $authorizers,
        private Container $container,
    ) {}

    /**
     * @param  class-string<Policy>  $policy
     * @param  object|class-string  $subject
     */
    public function authorize(ActorIdentity $target, string $policy, object|string $subject, BackedEnum $ability): void
    {
        $actor = $this->actors->get($target);
        $this->authorizers->forTarget($actor)->authorize($this->container->make($policy), $actor, $subject, $ability);
    }

    /**
     * @template TAbility of BackedEnum
     *
     * @param  class-string<Policy>  $policy
     * @param  object|class-string  $subject
     * @param  list<TAbility>  $abilities
     * @return list<TAbility>
     */
    public function filterActions(
        ActorIdentity $target,
        string $policy,
        object|string $subject,
        array $abilities,
    ): array {
        $actor = $this->actors->get($target);
        $authorizer = $this->authorizers->forTarget($actor);

        $made = $this->container->make($policy);

        return $this->authorizers->allowedAbilities($authorizer, $made, $actor, $subject, $abilities);
    }
}
