<?php

declare(strict_types=1);

namespace App\Actors\Support;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Exceptions\ActorContextMissing;
use Illuminate\Container\Attributes\Scoped;

/**
 * The one place this request's actor is kept, bound once per request as both CurrentActor and CurrentActorSetter, so the
 * reader and the middleware that fills it always share it and a long-running worker never carries it to the next one.
 */
#[Scoped]
final class ActorStore implements CurrentActor, CurrentActorSetter
{
    private ActorContext|null $actor = null;

    public function actor(): ActorContext
    {
        return $this->actor ?? throw ActorContextMissing::forRequest();
    }

    public function hasActor(): bool
    {
        return $this->actor !== null;
    }

    public function set(Actor $actor): void
    {
        $this->actor = ActorContext::of($actor);
    }

    public function clear(): void
    {
        $this->actor = null;
    }
}
