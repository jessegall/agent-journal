<?php

declare(strict_types=1);

namespace App\Hooks\Octane;

use Illuminate\Contracts\Foundation\Application;

/**
 * Hands the event dispatcher the container of the request, task or tick Octane is starting, as Octane does for the
 * router and the gate: the dispatcher outlives the request, and a class listener it builds, such as a model observer,
 * must get that request's scoped services, its running command among them, not the worker's.
 */
final readonly class GiveRequestContainerToEvents
{
    /**
     * @param  object{sandbox: Application}  $event
     */
    public function handle(object $event): void
    {
        if (! $event->sandbox->resolved('events')) {
            return;
        }

        $event->sandbox->make('events')->useContainer($event->sandbox);
    }
}
