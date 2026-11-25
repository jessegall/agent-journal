<?php

declare(strict_types=1);

namespace App\Pipes;

use App\Contracts\Bus\Pipe;
use App\Contracts\Events\ListenerFailureLog;
use App\Exceptions\InvalidListener;
use App\Support\AvailableListener;
use App\Support\IsolatedListener;
use App\Support\ListenerDeclarations;
use App\Support\ListenerRegistry;
use App\Support\Reflector;

/**
 * Wraps domain listeners for availability, in both lanes, and adds failure logging to the dispatcher's listeners
 * when their event requests it; a transaction listener's failure reaches the command's unit.
 */
final readonly class GateListenersByDomain implements Pipe
{
    public function handle(ListenerDeclarations $declarations): ListenerRegistry
    {
        $gated = [];
        $inTransaction = [];

        foreach ($declarations->events as $event => $listeners) {
            foreach ($listeners as $listener) {
                $available = $this->available($declarations, $event, $listener);

                $logsFailures = Reflector::exists($event)
                    && Reflector::of($event)->isSubclassOf(ListenerFailureLog::class);

                $gated[$event][] = $logsFailures
                    ? new IsolatedListener($event, $available)
                    : $available;
            }
        }

        foreach ($declarations->inCommandTransaction as $event => $listeners) {
            foreach ($listeners as $listener) {
                $inTransaction[$event][] = $this->available($declarations, $event, $listener);
            }
        }

        return new ListenerRegistry(inCommandTransaction: $inTransaction, afterCommit: $gated);
    }

    /**
     * The listener, wrapped so it runs only while the domain holding it is available.
     *
     * @throws InvalidListener
     */
    private function available(
        ListenerDeclarations $declarations,
        string $event,
        string $listener,
    ): string|AvailableListener {
        $class = explode('@', $listener, 2)[0];

        $listenerType = Reflector::find($class)->filter(fn (Reflector $type) => $type->isClass());

        if ($listenerType->isEmpty()) {
            throw InvalidListener::staleCache($listener, $event);
        }

        $file = $listenerType->get()->fileName()->getOrElse('');
        $domain = $declarations->ownership->domainHoldingListener($file);

        if ($domain === null) {
            return $listener;
        }

        return new AvailableListener($domain->name, $listener);
    }
}
