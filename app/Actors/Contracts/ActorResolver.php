<?php

declare(strict_types=1);

namespace App\Actors\Contracts;

use App\Actors\Exceptions\ActorUnavailable;
use App\Actors\Support\ActorIdentity;

/**
 * Finds the actor an identity names, through the provider registered for its type.
 */
interface ActorResolver
{
    /**
     * @throws ActorUnavailable when the actor is missing, retired or not allowed; all read the same
     */
    public function get(ActorIdentity $identity): Actor;
}
