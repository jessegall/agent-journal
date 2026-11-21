<?php

declare(strict_types=1);

namespace App\Domains\Pipes;

use App\Domains\Support\ListenerDeclarations;
use App\Domains\Support\ListenerOwnership;
use App\Pipelines\Contracts\Pipe;
use App\Reflection\Support\Reflector;

/**
 * Expands interface listeners into listeners for the exported events that implement the interface: the facts that
 * update the UI, and the facts that change a dockable source.
 */
final readonly class ExpandUiUpdaterListeners implements Pipe
{
    public function handle(ListenerDeclarations $declarations): ListenerDeclarations
    {
        $events = $declarations->events;

        foreach (ListenerOwnership::EXPANDED_INTERFACES as $interface) {
            $listeners = $events[$interface] ?? [];
            unset($events[$interface]);

            foreach ($declarations->ownership->exportedEvents() as $event) {
                if ($listeners !== [] && Reflector::of($event)->isSubclassOf($interface)) {
                    $events[$event] = array_values(array_unique([...$events[$event] ?? [], ...$listeners]));
                }
            }
        }

        return new ListenerDeclarations($events, $declarations->ownership);
    }
}
