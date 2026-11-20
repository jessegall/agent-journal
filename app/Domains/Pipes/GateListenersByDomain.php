<?php

declare(strict_types=1);

namespace App\Domains\Pipes;

use App\Contracts\ListenerFailureLog;
use App\Domains\Exceptions\InvalidListener;
use App\Domains\Support\AvailableListener;
use App\Domains\Support\FailureLoggingListener;
use App\Domains\Values\GatedListeners;
use App\Domains\Values\ListenerDeclarations;
use App\Pipelines\Contracts\Pipe;
use ReflectionClass;

/**
 * Wraps domain listeners for availability and adds failure logging when their event requests it.
 */
final readonly class GateListenersByDomain implements Pipe
{
    public function handle(ListenerDeclarations $declarations): GatedListeners
    {
        $gated = [];

        foreach ($declarations->events as $event => $listeners) {
            foreach ($listeners as $listener) {
                $class = explode('@', $listener, 2)[0];

                if (! class_exists($class)) {
                    throw InvalidListener::staleCache($listener, $event);
                }

                $file = (string) new ReflectionClass($class)->getFileName();
                $domain = $declarations->ownership->domainHoldingListener($file);
                $available = $domain === null ? $listener : new AvailableListener($domain->name, $listener);
                $gated[$event][] = is_subclass_of($event, ListenerFailureLog::class)
                    ? new FailureLoggingListener($event, $available)
                    : $available;
            }
        }

        return new GatedListeners($gated);
    }
}
