<?php

declare(strict_types=1);

namespace App\Communication\Support;

use App\Actors\Support\ActorIdentity;

/**
 * Where a message goes or comes from: an actor, and for an agent the session it is in. A user or the system has no
 * session.
 */
final readonly class MessageAddress
{
    private function __construct(public ActorIdentity $actor, public string|null $sessionId) {}

    public static function forUser(ActorIdentity $user): self
    {
        return new self($user, null);
    }

    public static function forAgent(ActorIdentity $agent, string $sessionId): self
    {
        return new self($agent, $sessionId);
    }

    public static function forSystem(): self
    {
        return new self(ActorIdentity::system(), null);
    }

    public function sameEndpointAs(self $other): bool
    {
        return $this->actor->isSameAs($other->actor) && $this->sessionId === $other->sessionId;
    }
}
