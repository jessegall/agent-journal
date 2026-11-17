<?php

declare(strict_types=1);

namespace App\Core\Actors\Support;

use App\Core\Actors\Enums\ActorKind;
use App\Core\Contracts\Actor;

/**
 * Who an actor is, by kind and id, apart from any request or session: user 3 and agent 3 are different actors.
 */
final readonly class ActorIdentity
{
    public function __construct(
        public ActorKind $kind,
        public int $id,
    ) {}

    public static function of(Actor $actor): self
    {
        return new self($actor->actorKind(), $actor->actorId());
    }

    public function isSameAs(self $other): bool
    {
        return $this->kind === $other->kind && $this->id === $other->id;
    }
}
