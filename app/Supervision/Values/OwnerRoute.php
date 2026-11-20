<?php

declare(strict_types=1);

namespace App\Supervision\Values;

use App\Actors\Support\ActorIdentity;
use App\Supervision\Enums\OwnerRouteType;

final readonly class OwnerRoute
{
    private function __construct(public OwnerRouteType $type, public ActorIdentity|null $actor) {}

    public static function chainEnd(ActorIdentity $actor): self
    {
        return new self(OwnerRouteType::ChainEnd, $actor);
    }

    public static function noOwner(): self
    {
        return new self(OwnerRouteType::NoOwner, null);
    }
}
