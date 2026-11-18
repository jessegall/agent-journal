<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\EventCalls\Plans\Providers;

use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Database\Events\ConnectionEstablished;
use Illuminate\Support\Facades\Event;
use Tests\Fixtures\Boundary\EventCalls\Plans\Events\PlanStarted;

final class RegistersByHand
{
    public function register(Dispatcher $events): void
    {
        Event::listen(PlanStarted::class, fn (PlanStarted $started) => null);
        $events->listen('plans.*', fn () => null);
        $events->listen(ConnectionEstablished::class, fn () => null);
        $events->listen('eloquent.booted: '.self::class, fn () => null);
    }

    public function subscribe(Dispatcher $events): void {}
}
