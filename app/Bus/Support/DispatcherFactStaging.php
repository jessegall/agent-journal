<?php

declare(strict_types=1);

namespace App\Bus\Support;

use App\Bus\Contracts\FactStaging;
use App\Contracts\Event;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Stages nothing and delivers a committed fact through the dispatcher: Core's staging while no
 * area binds one that keeps more.
 */
final readonly class DispatcherFactStaging implements FactStaging
{
    public function __construct(private Dispatcher $dispatcher) {}

    public function stage(Event $event): object|null
    {
        return null;
    }

    public function deliver(Event $event, object|null $staged): void
    {
        $this->dispatcher->dispatch($event);
    }
}
