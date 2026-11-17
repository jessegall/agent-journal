<?php

declare(strict_types=1);

namespace App\Core\Actors\Support;

use App\Core\Actors\Enums\ActorKind;
use App\Core\Actors\Exceptions\AgentActorRequired;
use App\Core\Actors\Exceptions\UserActorRequired;
use App\Core\Actors\Contracts\Actor;

/**
 * Who acts in this request, filled by the middleware that authenticated them and kept for this request only. A user
 * stays the actor when they select an agent; the agent is then a target, never the caller.
 */
final readonly class ActorContext implements Actor
{
    private function __construct(
        public ActorKind $kind,
        public int $id,
    ) {}

    /**
     * The actor an authenticating middleware vouched for.
     */
    public static function of(Actor $actor): self
    {
        return new self($actor->actorKind(), $actor->actorId());
    }

    public static function forAgent(int $agentId): self
    {
        return new self(ActorKind::Agent, $agentId);
    }

    /**
     * Only the domain that owns users and their access fills this, after its policy let the user in.
     */
    public static function forUser(int $userId): self
    {
        return new self(ActorKind::User, $userId);
    }

    public function actorKind(): ActorKind
    {
        return $this->kind;
    }

    public function actorId(): int
    {
        return $this->id;
    }

    public function isUser(): bool
    {
        return $this->kind === ActorKind::User;
    }

    public function requireUser(): void
    {
        if (! $this->isUser()) {
            throw UserActorRequired::forActor($this->kind->value);
        }
    }

    /**
     * @throws AgentActorRequired
     */
    public function requireAgent(): void
    {
        if ($this->kind !== ActorKind::Agent) {
            throw AgentActorRequired::forActor($this->kind->value);
        }
    }
}
