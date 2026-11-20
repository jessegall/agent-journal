<?php

declare(strict_types=1);

namespace App\Domains\Pipes;

use App\Domains\Values\ListenerDeclarations;
use App\Pipelines\Contracts\Pipe;
use App\Ui\Contracts\UserInterfaceUpdater;

/**
 * Expands interface listeners into listeners for exported events that update the UI.
 */
final readonly class ExpandUiUpdaterListeners implements Pipe
{
    public function handle(ListenerDeclarations $declarations): ListenerDeclarations
    {
        $events = $declarations->events;
        $listeners = $events[UserInterfaceUpdater::class] ?? [];
        unset($events[UserInterfaceUpdater::class]);

        if ($listeners === []) {
            return new ListenerDeclarations($events, $declarations->ownership);
        }

        foreach ($declarations->ownership->exportedEvents() as $event) {
            if (is_subclass_of($event, UserInterfaceUpdater::class)) {
                $events[$event] = array_values(array_unique([...$events[$event] ?? [], ...$listeners]));
            }
        }

        return new ListenerDeclarations($events, $declarations->ownership);
    }
}
