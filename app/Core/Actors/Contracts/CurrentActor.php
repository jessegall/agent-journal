<?php

declare(strict_types=1);

namespace App\Core\Actors\Contracts;

use App\Core\Actors\Exceptions\ActorContextMissing;
use App\Core\Actors\Support\ActorContext;
use App\Core\Actors\Support\ActorStore;
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
