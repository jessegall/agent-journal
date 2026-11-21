<?php

declare(strict_types=1);

namespace App\Hooks\StateEvents;

use App\Bus\Contracts\FactStaging;
use App\Contracts\Event;
use Illuminate\Contracts\Container\Container;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Stages a bridged fact's dispatch with the audience its sibling's admission holds while its command runs, and
 * delivers it after the commit under that audience, the bridge last; a fact no state observes goes out plainly, and
 * a sibling never borrows another's audience. The dispatcher is asked by its name each time, since a test's fake
 * replaces it.
 */
final readonly class StateBridgeFactStaging implements FactStaging
{
    public function __construct(private Container $container, private StateEventScope $scope) {}

    public function stage(Event $event): object|null
    {
        $dispatcher = $this->dispatcherNow();

        return $dispatcher instanceof StateEventDispatcher && $dispatcher->bridges($event::class)
            ? $this->scope->capture($event)
            : null;
    }

    public function deliver(Event $event, object|null $staged): void
    {
        $dispatcher = $this->dispatcherNow();

        if ($dispatcher instanceof StateEventDispatcher && $staged instanceof StateEventDispatch) {
            $dispatcher->dispatchStaged($staged);

            return;
        }

        $this->container->make(Dispatcher::class)->dispatch($event);
    }

    /**
     * The dispatcher the container holds now: the state event dispatcher, or a test's fake in its place.
     */
    private function dispatcherNow(): object
    {
        return $this->container->make('events');
    }
}
