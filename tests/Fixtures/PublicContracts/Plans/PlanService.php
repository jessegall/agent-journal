<?php

declare(strict_types=1);

namespace Tests\Fixtures\PublicContracts\Plans;

use Illuminate\Contracts\Events\Dispatcher;

final readonly class PlanService
{
    public function __construct(private Dispatcher $events) {}

    public function announce(): void
    {
        $this->events->dispatch('plan.announced');
    }
}
