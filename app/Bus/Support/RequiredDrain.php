<?php

declare(strict_types=1);

namespace App\Bus\Support;

use App\Bus\Exceptions\CausalDepthExceeded;
use App\Contracts\Event;
use App\Domains\Support\AvailableListener;
use App\Domains\Support\RequiredListenerRegistry;
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
        $unit->pump(function () use ($unit): void {
            $unit->seal();

            for ($next = $unit->takePending(); $next !== null; $next = $unit->takePending()) {
                $chain = [...$next['chain'], $next['event']::class];

                if (count($chain) > self::CAUSAL_DEPTH_LIMIT) {
                    throw CausalDepthExceeded::along($chain, self::CAUSAL_DEPTH_LIMIT);
                }

                $unit->drain($next['event'], $chain, fn () => $this->runListenersOf($next['event']));
            }
        });
    }

    private function runListenersOf(Event $event): void
    {
        foreach ($this->registry->listenersOf($event::class) as $listener) {
            if ($listener instanceof AvailableListener) {
                $listener($event);

                continue;
            }

            [$class, $method] = array_pad(explode('@', $listener, 2), 2, 'handle');
            $this->container->make($class)->{$method}($event);
        }
    }
}
