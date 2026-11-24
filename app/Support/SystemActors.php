<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\Actor;
use App\Contracts\Actors\ActorProvider;
use App\Exceptions\ActorUnavailable;

/**
 * The one system actor, the journal itself.
 */
final readonly class SystemActors implements ActorProvider
{
    public function actor(ActorIdentity $identity): Actor
    {
        if ($identity->isSameAs(
            ActorIdentity::system(),
        )) {
            return new SystemActor();
        }

        throw ActorUnavailable::forIdentity($identity);
    }
}
