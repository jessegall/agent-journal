<?php

declare(strict_types=1);

namespace App\Actors\Support;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\CurrentAuthorizer;
use App\Operations\Enums\AccessType;

/**
 * Authorization for the actor of this request: the authorizer its type's provider gives it, asked with the policy the
 * container builds. It is bound per request, so nothing it resolves outlives the request.
 */
final readonly class CurrentActorAuthorizer implements CurrentAuthorizer
{
    public function __construct(private CurrentActor $actors, private ActorAuthorizers $authorizers) {}

    public function authorize(string $policy, object|string $subject, AccessType $access): void
    {
        $actor = $this->actors->actor();
        $this->authorizers->assertAllowed($this->authorizers->forActor($actor), $policy, $actor, $subject, $access);
    }

    public function filterActions(string $policy, object|string $subject, array $accesses): array
    {
        $actor = $this->actors->actor();
        $authorizer = $this->authorizers->forActor($actor);

        return $this->authorizers->allowedAccesses($authorizer, $policy, $actor, $subject, $accesses);
    }
}
