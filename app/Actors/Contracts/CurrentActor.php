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
}
