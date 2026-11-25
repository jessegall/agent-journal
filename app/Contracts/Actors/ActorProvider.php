<?php

declare(strict_types=1);

namespace App\Contracts\Actors;

use App\Exceptions\ActorUnavailable;
use App\Support\ActorReference;

/**
 * Finds the actors of one type, registered with the actor registry by the owner of that type.
 */
interface ActorProvider
{
    /**
     * @throws ActorUnavailable
     */
    public function actor(ActorReference $identity): Actor;
}
