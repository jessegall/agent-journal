<?php

declare(strict_types=1);

namespace App\Actors;

use App\Access\Contracts\AuthoritySource;
use App\Actors\Contracts\Actor;
use App\Actors\Contracts\ActorRunner;
use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Exceptions\ActorContextMissing;
use App\Support\ActorReference;
use App\Values\StartProfileAuthority;
use App\Values\TrustedEntryAuthority;
use Closure;
use Illuminate\Container\Attributes\Scoped;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

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
     * @var list<array{ActorReference, AuthoritySource}>
     */
    private array $installed = [];

    public function actor(): ActorReference
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

    public function startProfileAuthority(): Option
    {
        if (! $this->hasActor()) {
            return None::create();
        }

        $authority = $this->authority();

        if (! $authority instanceof StartProfileAuthority) {
            return None::create();
        }

        return new Some($authority);
    }

    public function set(Actor $actor, AuthoritySource $authority): void
    {
        $this->installed = [[
            ActorReference::of($actor),
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
        return $this->within(ActorReference::of(new SystemActor()), new TrustedEntryAuthority($entry), $work);
    }

    /**
     * @template TResult
     *
     * @param  Closure(): TResult  $work
     * @return TResult
     */
    public function within(ActorReference $actor, AuthoritySource $authority, Closure $work): mixed
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
     * @return array{ActorReference, AuthoritySource}
     *
     * @throws ActorContextMissing
     */
    private function current(): array
    {
        return $this->installed[0] ?? throw ActorContextMissing::forRequest();
    }
}
