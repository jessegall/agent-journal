<?php

declare(strict_types=1);

namespace App\Bus\Support;

use App\Bus\Contracts\FactStaging;
use App\Contracts\Event;
use Illuminate\Contracts\Container\Container;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Stages nothing and delivers a committed fact through the dispatcher bound at delivery, so a dispatcher swapped in
 * later, such as a test's fake, receives it: Core's staging while no area binds one that keeps more.
 */
final readonly class DispatcherFactStaging implements FactStaging
{
    public function __construct(private Container $container) {}

    public function stage(Event $event): object|null
    {
        return null;
    }

    public function deliver(Event $event, object|null $staged): void
    {
        $this->container->make(Dispatcher::class)->dispatch($event);
    }
}
