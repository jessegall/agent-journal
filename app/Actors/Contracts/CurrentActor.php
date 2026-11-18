<?php

declare(strict_types=1);

namespace App\Actors\Contracts;

use App\Actors\Exceptions\ActorContextMissing;
use App\Actors\Support\ActorContext;
use App\Actors\Support\ActorStore;
use Illuminate\Container\Attributes\Bind;

/**
 * Who acts in this request, for reading only: set by an authenticating middleware, never by the reader.
 */
#[Bind(ActorStore::class)]
interface CurrentActor
{
    /**
     * @throws ActorContextMissing when no middleware set an actor for this request
     */
    public function actor(): ActorContext;

    public function hasActor(): bool;

    /**
     * Whether a signed-in user or agent acts, the only actors ordinary content scopes admit.
     */
    public function isSignedIn(): bool;

    /**
     * Whether the journal itself acts, as the system or the engine, which sees no row through an ordinary content
     * scope.
     */
    public function isJournalActor(): bool;
}
