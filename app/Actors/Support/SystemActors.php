<?php

declare(strict_types=1);

namespace App\Actors\Support;

use App\Actors\Contracts\Actor;
use App\Actors\Contracts\ActorProvider;
use App\Actors\Exceptions\ActorUnavailable;

/**
 * The one system actor, system:1.
 */
final readonly class SystemActors implements ActorProvider
{
    public function actor(ActorIdentity $identity): Actor
    {
        return $identity->isSameAs(ActorIdentity::system()) ? new SystemActor() : throw ActorUnavailable::forIdentity($identity);
    }
}
