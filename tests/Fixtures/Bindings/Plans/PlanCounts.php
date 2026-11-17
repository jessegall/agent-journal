<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bindings\Plans;

use App\Core\Actors\Contracts\CurrentActor;
use Illuminate\Container\Attributes\Singleton;
use Tests\Fixtures\Bindings\Plans\Contracts\PlanCounter;

#[Singleton]
final readonly class PlanCounts implements PlanCounter
{
    public function __construct(private CurrentActor $actor) {}

    public function hasActor(): bool
    {
        return $this->actor->hasActor();
    }
}
