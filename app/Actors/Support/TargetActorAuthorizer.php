<?php

declare(strict_types=1);

namespace App\Actors\Support;

use App\Actors\Contracts\ActorResolver;
use App\Actors\Contracts\TargetAuthorizer;
use App\Operations\Enums\AccessType;

/**
 * Asks the target actor's own provider, chosen by the target's type through the registry; each evaluation stands
 * alone, so one target's refusal never changes the next one's answer.
 */
final readonly class TargetActorAuthorizer implements TargetAuthorizer
{
    public function __construct(private ActorResolver $actors, private ActorAuthorizers $authorizers) {}

    public function authorize(ActorIdentity $target, string $policy, object|string $subject, AccessType $access): void
    {
        $actor = $this->actors->get($target);
        $this->authorizers->assertAllowed($this->authorizers->forTarget($actor), $policy, $actor, $subject, $access);
    }

    public function filterActions(ActorIdentity $target, string $policy, object|string $subject, array $accesses): array
    {
        $actor = $this->actors->get($target);
        $authorizer = $this->authorizers->forTarget($actor);

        return $this->authorizers->allowedAccesses($authorizer, $policy, $actor, $subject, $accesses);
    }
}
