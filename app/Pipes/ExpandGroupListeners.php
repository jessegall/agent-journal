<?php

declare(strict_types=1);

namespace App\Pipes;

use App\Contracts\Bus\Pipe;
use App\Support\ListenerDeclarations;
use App\Support\ListenerOwnership;
use App\Support\ReflectedType;

/**
 * Wires a listener typed on a group of events, a base class or an interface, to every event of that group, so a new
 * event is heard by joining the group, with no list of events to add it to.
 */
final readonly class ExpandGroupListeners implements Pipe
{
    public function handle(ListenerDeclarations $declarations): ListenerDeclarations
    {
        $events = $declarations->events;

        foreach (array_keys($events) as $type) {
            if (! ReflectedType::exists($type) || ! ListenerOwnership::isGroup($type)) {
                continue;
            }

            $listeners = $events[$type];
            unset($events[$type]);

            foreach ($declarations->ownership->eventsOf($type) as $event) {
                $events[$event] = array_values(array_unique([
                    ...$events[$event] ?? [],
                    ...$listeners,
                ]));
            }
        }

        return new ListenerDeclarations($events, $declarations->ownership);
    }
}
