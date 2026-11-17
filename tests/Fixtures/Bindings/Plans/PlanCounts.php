<?php

declare(strict_types=1);

namespace Tests\Fixtures\Bindings\Plans;

use App\Core\Contracts\CurrentActor;
use Illuminate\Container\Attributes\Singleton;
use Tests\Fixtures\Bindings\Plans\Contracts\PlanCounter;

#[Singleton]
final readonly class PlanCounts implements PlanCounter
{
    public function __construct(private CurrentActor $actor) {}
}
