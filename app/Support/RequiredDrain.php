<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Events\Event;
use App\Exceptions\CausalDepthExceeded;
use Illuminate\Contracts\Container\Container;

/**
 * Applies the required listeners of a unit's facts inside the transaction: it seals the open slot, then takes the
 * facts first in first out and runs each one's required listeners in their order, directly, never through the
 * dispatcher; a fact a listener raises joins the end of the queue one step deeper in its chain. One pump runs at a
 * time, and a listener's failure marks the unit failed and propagates.
 */
final readonly class RequiredDrain
{
    /**
     * The deepest chain of facts raised by required listeners of earlier facts; deeper is a loop.
     */
    public const int CAUSAL_DEPTH_LIMIT = 32;

    public function __construct(private RequiredListenerRegistry $registry, private Container $container) {}

    /**
     * @throws CausalDepthExceeded
     */
    public function applyRequired(EventUnit $unit): void
    {
        $unit->runUnlessDraining(function () use ($unit): void {
            $unit->seal();

            while ($unit->hasPending()) {
                $next = $unit->takePending();
                $chain = $next->chainWithItself();

                if (count($chain) > self::CAUSAL_DEPTH_LIMIT) {
                    throw CausalDepthExceeded::along($chain, self::CAUSAL_DEPTH_LIMIT);
                }

                $unit->drain($next, fn () => $this->runListenersOf($next->event));
            }
        });
    }

    /**
     * Runs the fact's required listeners at once, for a fact sent where no unit holds a queue.
     */
    public function applyNow(Event $event): void
    {
        $this->runListenersOf($event);
    }

    private function runListenersOf(Event $event): void
    {
        foreach ($this->registry->listenersOf($event::class) as $listener) {
            if (is_callable($listener)) {
                $listener($event);

                continue;
            }

            [$class, $method] = array_pad(explode('@', $listener, 2), 2, 'handle');
            $this->container->make($class)->{$method}($event);
        }
    }
}
