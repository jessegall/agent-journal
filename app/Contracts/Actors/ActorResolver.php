<?php

declare(strict_types=1);

namespace App\Contracts\Actors;

use App\Exceptions\ActorUnavailable;
use App\Support\ActorReference;

/**
 * Finds the actor an identity names, through the provider registered for its type.
 */
interface ActorResolver
{
    /**
     * @throws ActorUnavailable when the actor is missing, retired or not allowed; all read the same
     */
    public function get(ActorReference $identity): Actor;
}
