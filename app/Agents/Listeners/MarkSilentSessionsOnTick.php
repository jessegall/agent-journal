<?php

declare(strict_types=1);

namespace App\Agents\Listeners;

use App\Agents\Commands\MarkSilentSessions;
use App\Bus\Contracts\CommandBus;
use App\Engine\Contracts\EngineListener;
use App\Engine\Events\EngineTicked;

/**
 * Sweeps for silent sessions on every engine pass; the sweep is one bounded update, so it needs no throttle.
 */
final readonly class MarkSilentSessionsOnTick implements EngineListener
{
    public function __construct(private CommandBus $commands) {}

    public function maintenanceScope(): string
    {
        return MarkSilentSessions::MAINTENANCE_SCOPE;
    }

    public function __invoke(EngineTicked $event): void
    {
        $this->commands->run(new MarkSilentSessions);
    }
}
