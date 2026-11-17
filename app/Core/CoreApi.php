<?php

declare(strict_types=1);

namespace App\Core;

use App\Core\Actors\ActorContext;
use App\Core\Actors\ActorKind;
use App\Core\Actors\Exceptions\ActorContextMissing;
use App\Core\Actors\Exceptions\PersonActorRequired;
use App\Core\Contracts\Actor;

/**
 * Core's public surface: the types every domain and module may use, written out one by one. Everything else in Core is
 * private, whatever folder it sits in. Core is not a domain and is never required; domains use it without declaring it.
 */
final class CoreApi
{
    /**
     * @return list<class-string>
     */
    public static function exports(): array
    {
        return [
            Actor::class,
            ActorKind::class,
            ActorContext::class,
            ActorContextMissing::class,
            PersonActorRequired::class,
        ];
    }
}
