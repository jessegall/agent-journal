<?php

declare(strict_types=1);

namespace App\Actors\Contracts;

use App\Actors\Exceptions\ActorContextMissing;
use App\Actors\Support\ActorContext;

/**
 * Who acts in this request, for reading only: set by an authenticating middleware, never by the reader.
 */
interface CurrentActor
{
    /**
     * @throws ActorContextMissing when no middleware set an actor for this request
     */
    public function actor(): ActorContext;

    public function hasActor(): bool;

    /**
     * Where the acting actor's authority comes from, installed with it.
     *
     * @throws ActorContextMissing when no entry point set an actor for this request
     */
    public function authority(): AuthoritySource;
}
