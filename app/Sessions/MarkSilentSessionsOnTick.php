<?php

declare(strict_types=1);

namespace App\Sessions;

use App\Bus\Contracts\CommandBus;
use App\Contracts\Events\EngineListener;
use App\Events\Engine\EngineTicked;
use App\Sessions\Commands\MarkSilentSessions\MarkSilentSessionsCommand;

/**
 * Sweeps for silent sessions on every engine pass; the sweep is one bounded update, so it needs no throttle.
 */
final readonly class MarkSilentSessionsOnTick implements EngineListener
{
    public function __construct(private CommandBus $commands) {}

    public function maintenanceScope(): string
    {
        return MarkSilentSessionsCommand::MAINTENANCE_SCOPE;
    }

    public function __invoke(EngineTicked $event): void
    {
        $this->commands->run(new MarkSilentSessionsCommand());
    }
}
