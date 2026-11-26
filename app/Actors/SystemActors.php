<?php

declare(strict_types=1);

namespace App\Actors;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\ActorProvider;
use App\Exceptions\ActorUnavailable;
use App\Support\ActorReference;

/**
 * The one system actor, the journal itself.
 */
final readonly class SystemActors implements ActorProvider
{
    public function actor(ActorReference $identity): Actor
    {
        if ($identity->isSameAs(
            ActorReference::system(),
        )) {
            return new SystemActor();
        }

        throw ActorUnavailable::forIdentity($identity);
    }
}
