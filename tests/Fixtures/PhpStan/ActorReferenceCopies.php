<?php

declare(strict_types=1);

namespace Tests\Fixtures\PhpStan;

use App\Contracts\Actors\Actor;
use App\Support\ActorReference;
use App\Support\Command;

/**
 * A copy of a reference, of a command's dispatcher, and a reference made from an actor, which is the one call allowed.
 */
final class ActorReferenceCopies
{
    public function copy(ActorReference $reference): ActorReference
    {
        return ActorReference::of($reference);
    }

    /**
     * @param  Command<mixed>  $command
     */
    public function dispatcher(Command $command): ActorReference
    {
        return ActorReference::of($command->dispatchedBy());
    }

    public function fromActor(Actor $actor): ActorReference
    {
        return ActorReference::of($actor);
    }
}
