<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\Actor;
use App\Models\Access\User;
use App\Models\Agents\Agent;

/**
 * Who acts in this request, filled by the middleware that authenticated them and kept for this request only. A user
 * stays the actor when they select an agent; the agent is then a target, never the caller.
 */
final readonly class ActorContext implements Actor
{
    private function __construct(
        public string $type,
        public string $id,
    ) {}

    /**
     * The actor an authenticating middleware vouched for.
     */
    public static function of(Actor $actor): self
    {
        return new self($actor->actorType(), $actor->actorId());
    }

    public static function forAgent(string $agentId): self
    {
        return new self(Agent::storedType(), $agentId);
    }

    /**
     * Only the domain that owns users and their access fills this, after its policy let the user in.
     */
    public static function forUser(string $userId): self
    {
        return new self(User::storedType(), $userId);
    }

    public function actorType(): string
    {
        return $this->type;
    }

    public function isAgent(): bool
    {
        return $this->type === Agent::storedType();
    }

    public function actorId(): string
    {
        return $this->id;
    }
}
