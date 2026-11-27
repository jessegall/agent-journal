<?php

declare(strict_types=1);

namespace App\Actors\Contracts;

use App\Access\Contracts\AuthoritySource;
use App\Actors\Exceptions\ActorContextMissing;
use App\Support\ActorReference;
use App\Values\StartProfileAuthority;
use PhpOption\Option;

/**
 * Who acts in this request, for reading only: set by an authenticating middleware, never by the reader.
 */
interface CurrentActor
{
    /**
     * @throws ActorContextMissing when no middleware set an actor for this request
     */
    public function actor(): ActorReference;

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

    /**
     * The start profile the acting agent's session was started with; none when no actor acts or it acts otherwise.
     *
     * @return Option<StartProfileAuthority>
     */
    public function startProfileAuthority(): Option;
}
