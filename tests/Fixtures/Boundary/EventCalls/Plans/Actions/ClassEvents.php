<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\EventCalls\Plans\Actions;

use Illuminate\Support\Facades\Event;
use Tests\Fixtures\Boundary\EventCalls\Plans\Events\PlanStarted;

final class ClassEvents
{
    public function raise(): void
    {
        event(new PlanStarted(1));
        Event::dispatch(new PlanStarted(2));
        Event::listen(PlanStarted::class, fn () => null);
    }
}
