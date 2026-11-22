<?php

declare(strict_types=1);

namespace App\Contracts\Authorization;

use App\Contracts\Actors\Actor;
use App\Exceptions\ActorNotAllowed;

/**
 * What the owner of an actor type answers for authorization: the authorizer its profile gives the acting actor, and
 * the one it gives another actor of its type, from that actor's own stored source and never the caller's rights.
 */
interface AuthorizerProvider
{
    public function forActor(Actor $actor): Authorizer;

    /**
     * @throws ActorNotAllowed when the target has no stored source of authority to evaluate
     */
    public function forTarget(Actor $target): Authorizer;
}
