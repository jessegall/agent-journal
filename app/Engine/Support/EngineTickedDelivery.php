<?php

declare(strict_types=1);

namespace App\Engine\Support;

use App\Engine\Events\EngineTicked;
use Illuminate\Contracts\Container\Container;
use Illuminate\Contracts\Events\Dispatcher;
use Psr\Log\LoggerInterface;
use Throwable;

/**
 * Delivers one EngineTicked to every engine listener, each built for this pass and granted only its own maintenance
 * scope; a listener that throws is logged and the next still runs. Plain observers hear it last, on the dispatcher.
 */
final readonly class EngineTickedDelivery
{
    public function __construct(
        private EngineListenerSet $listeners,
        private EngineAccess $access,
        private Container $container,
        private LoggerInterface $log,
        private Dispatcher $events,
    ) {}

    public function deliver(EngineTicked $event): void
    {
        foreach ($this->listeners->all() as $listenerClass) {
            try {
                $listener = $this->container->make($listenerClass);
                $this->access->grantMaintenance($listener->maintenanceScope());
                $listener($event);
            } catch (Throwable $failure) {
                $this->log->error('Engine listener failed', ['listener' => $listenerClass, 'exception' => $failure]);
            } finally {
                $this->access->clear();
            }
        }

        $this->events->dispatch($event);
    }
}
