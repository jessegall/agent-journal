<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\Actor;
use App\Contracts\Actors\ActorRunner;
use App\Contracts\Actors\CurrentActor;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Authorization\AuthoritySource;
use App\Exceptions\ActorContextMissing;
use App\Values\TrustedEntryAuthority;
use Closure;
use Illuminate\Container\Attributes\Scoped;

/**
 * The one place this request's actor is kept, bound once per request as both CurrentActor and CurrentActorSetter, so
 * the
 * reader and the middleware that fills it always share it and a long-running worker never carries it to the next one.
 */
#[Scoped]
final class ActorStore implements ActorRunner, CurrentActor, CurrentActorSetter
{
    /**
     * The acting actor with the source of its authority, installed and cleared together; empty when none acts.
     *
     * @var list<array{ActorIdentity, AuthoritySource}>
     */
    private array $installed = [];

    public function actor(): ActorIdentity
    {
        return $this->current()[0];
    }

    public function authority(): AuthoritySource
    {
        return $this->current()[1];
    }

    public function hasActor(): bool
    {
        return $this->installed !== [];
    }

    public function set(Actor $actor, AuthoritySource $authority): void
    {
        $this->installed = [[
            ActorIdentity::of($actor),
            $authority,
        ]];
    }

    public function clear(): void
    {
        $this->installed = [];
    }

    /**
     * Runs trusted Core work as the journal itself, under the named trusted entry, then gives back the actor and
     * authority held before, also when the work throws, so no later request or job keeps the system actor. It is the
     * only way to act as the system.
     *
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @return TResult
     */
    public function actAsSystem(string $entry, Closure $work): mixed
    {
        return $this->within(ActorIdentity::of(new SystemActor()), new TrustedEntryAuthority($entry), $work);
    }

    /**
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @return TResult
     */
    public function within(ActorIdentity $actor, AuthoritySource $authority, Closure $work): mixed
    {
        $before = $this->installed;
        $this->set($actor, $authority);

        try {
            return $work();
        } finally {
            $this->installed = $before;
        }
    }

    /**
     * @return array{ActorIdentity, AuthoritySource}
     *
     * @throws ActorContextMissing
     */
    private function current(): array
    {
        return $this->installed[0] ?? throw ActorContextMissing::forRequest();
    }
}
