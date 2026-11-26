<?php

declare(strict_types=1);

namespace App\Support;

use App\Actors\Contracts\Actor;
use App\Concerns\ComparesTypeAndId;

/**
 * Who holds a record: the registered assignee type and its id. An actor is one kind of assignee; a desk is another.
 */
final readonly class AssigneeIdentity
{
    use ComparesTypeAndId;

    public function __construct(public string $type, public string $id) {}

    public static function of(Actor $actor): self
    {
        return new self($actor->actorType(), $actor->actorId());
    }

    public static function ofActorReference(ActorReference $actor): self
    {
        return new self($actor->type, $actor->id);
    }
}
