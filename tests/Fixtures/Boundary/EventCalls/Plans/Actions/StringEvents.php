<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\EventCalls\Plans\Actions;

use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Facades\Event;

final class StringEvents
{
    public function __construct(private readonly Dispatcher $dispatcher) {}

    public function raise(): void
    {
        event('task.closed');
        Event::dispatch('task.closed');
        Event::listen(['task.closed'], fn () => null);
        \Event::listen('task.closed', fn () => null);
        $this->dispatcher->listen('task.closed', fn () => null);
        $this->dispatcher->dispatch('a.job.name');
    }
}
