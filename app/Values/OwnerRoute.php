<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\OwnerRouteType;
use App\Support\ActorIdentity;

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

    /**
     * Whether the route ends at this actor; a route with no owner ends at nobody.
     */
    public function endsAt(ActorIdentity $actor): bool
    {
        return $this->actor?->isSameAs($actor) ?? false;
    }
}
