<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\Actor;
use App\Contracts\Authorization\Authorizer;
use App\Contracts\Authorization\Policy;
use App\Enums\Agents\AccessType;
use App\Exceptions\ActorNotAllowed;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\Access\Response;

/**
 * The authorizer an actor's profile gives it, from the provider its actor type registered, and the one evaluation
 * path both the current actor and a target take: the subject is checked against the policy's model, then the
 * authorizer answers with a Laravel response.
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
     * @param  class-string<Policy>  $policy
     * @param  object|class-string  $subject
     *
     * @throws ActorNotAllowed
     */
    public function assertAllowed(
        Authorizer $authorizer,
        string $policy,
        Actor $actor,
        object|string $subject,
        AccessType $access,
    ): void {
        try {
            $this->evaluate($authorizer, $policy, $actor, $subject, $access)->authorize();
        } catch (AuthorizationException $denial) {
            throw ActorNotAllowed::fromDenial($denial, $access, class_basename($policy::model()));
        }
    }

    /**
     * The accesses of the list the authorizer allows the actor on the subject, in the order given.
     *
     * @param  class-string<Policy>  $policy
     * @param  object|class-string  $subject
     * @param  list<AccessType>  $accesses
     * @return list<AccessType>
     */
    public function allowedAccesses(
        Authorizer $authorizer,
        string $policy,
        Actor $actor,
        object|string $subject,
        array $accesses,
    ): array {
        return array_values(array_filter(
            $accesses,
            fn (AccessType $access) => $this->evaluate($authorizer, $policy, $actor, $subject, $access)->allowed(),
        ));
    }

    /**
     * @param  class-string<Policy>  $policy
     * @param  object|class-string  $subject
     */
    private function evaluate(
        Authorizer $authorizer,
        string $policy,
        Actor $actor,
        object|string $subject,
        AccessType $access,
    ): Response {
        $given = is_object($subject) ? $subject::class : $subject;

        if ($given !== $policy::model()) {
            return Response::deny("{$policy} guards ".$policy::model().", not {$given}.");
        }

        return $authorizer->evaluate($policy, $actor, $subject, $access);
    }
}
