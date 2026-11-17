<?php

declare(strict_types=1);

namespace App\Core\Actors;

use App\Core\Actors\Exceptions\PersonActorRequired;

/**
 * Who acts in this request, filled by the middleware that authenticated them and kept for this request only. A person
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
     * Only the domain that owns people and their access fills this, after its policy let the person in.
     */
    public static function forPerson(int $personId): self
    {
        return new self(ActorKind::Person, $personId);
    }

    public function actorKind(): ActorKind
    {
        return $this->kind;
    }

    public function actorId(): int
    {
        return $this->id;
    }

    public function isPerson(): bool
    {
        return $this->kind === ActorKind::Person;
    }

    public function requirePerson(): void
    {
        if (! $this->isPerson()) {
            throw PersonActorRequired::forActor($this->kind->value);
        }
    }
}
