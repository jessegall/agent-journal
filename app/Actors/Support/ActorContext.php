<?php

declare(strict_types=1);

namespace App\Actors\Support;

use App\Actors\Contracts\Actor;
use App\Actors\Enums\ActorType;
use App\Actors\Exceptions\AgentActorRequired;
use App\Actors\Exceptions\UserActorRequired;

/**
 * Who acts in this request, filled by the middleware that authenticated them and kept for this request only. A user
 * stays the actor when they select an agent; the agent is then a target, never the caller.
 */
final readonly class ActorContext implements Actor
{
    private function __construct(
        public ActorType $type,
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
        return new self(ActorType::Agent, $agentId);
    }

    /**
     * Only the domain that owns users and their access fills this, after its policy let the user in.
     */
    public static function forUser(string $userId): self
    {
        return new self(ActorType::User, $userId);
    }

    public function actorType(): ActorType
    {
        return $this->type;
    }

    public function actorId(): string
    {
        return $this->id;
    }

    public function isUser(): bool
    {
        return $this->type === ActorType::User;
    }

    public function requireUser(): void
    {
        if (! $this->isUser()) {
            throw UserActorRequired::forActor($this->type->value);
        }
    }

    /**
     * @throws AgentActorRequired
     */
    public function requireAgent(): void
    {
        if ($this->type !== ActorType::Agent) {
            throw AgentActorRequired::forActor($this->type->value);
        }
    }
}
