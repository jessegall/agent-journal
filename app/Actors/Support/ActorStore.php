<?php

declare(strict_types=1);

namespace App\Actors\Support;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Exceptions\ActorContextMissing;
use Closure;
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

    public function isSignedIn(): bool
    {
        return $this->actor !== null && $this->actor->type->isSignedIn();
    }

    public function isJournalActor(): bool
    {
        return $this->actor !== null && ! $this->actor->type->isSignedIn();
    }

    public function set(Actor $actor): void
    {
        $this->actor = ActorContext::of($actor);
    }

    public function clear(): void
    {
        $this->actor = null;
    }

    /**
     * Runs trusted Core work as the journal itself, then gives back the actor held before, also when the work throws,
     * so no later request or job keeps the system actor. It is the only way to act as the system.
     *
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @return TResult
     */
    public function actAsSystem(Closure $work): mixed
    {
        $before = $this->actor;
        $this->actor = ActorContext::of(new SystemActor());

        try {
            return $work();
        } finally {
            $this->actor = $before;
        }
    }
}
