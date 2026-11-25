<?php

declare(strict_types=1);

namespace App\Contracts\Actors;

use App\Contracts\Authorization\AuthoritySource;
use App\Exceptions\ActorContextMissing;
use App\Support\ActorIdentity;

/**
 * Who acts in this request, for reading only: set by an authenticating middleware, never by the reader.
 */
interface CurrentActor
{
    /**
     * @throws ActorContextMissing when no middleware set an actor for this request
     */
    public function actor(): ActorIdentity;

    /**
     * Whether the running request or job acts for an actor at all.
     */
    public function hasActor(): bool;

    /**
     * Where the acting actor's authority comes from, installed with it.
     *
     * @throws ActorContextMissing when no entry point set an actor for this request
     */
    public function authority(): AuthoritySource;
}
