<?php

declare(strict_types=1);

namespace App\Core\Actors;

use App\Core\Actors\Exceptions\PersonActorRequired;

/**
 * Who acts in this request, filled by the middleware that authenticated them and kept for this request only. A person
 * stays the actor when they select an agent; the agent is then a target, never the caller.
 */
final readonly class ActorContext
{
    private function __construct(
        public ActorKind $kind,
        public int $id,
    ) {}

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
