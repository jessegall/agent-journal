<?php

declare(strict_types=1);

namespace App\Sessions;

use App\Agents\Drivers\Commands\InterruptStuckTurns\InterruptStuckTurnsCommand;
use App\Bus\Contracts\CommandBus;
use App\Contracts\Events\EngineListener;
use App\Events\Engine\EngineTicked;

/**
 * Interrupts the turns that ran past the journal's limit on every engine pass; the sweep is one bounded batch.
 */
final readonly class InterruptStuckTurnsOnTick implements EngineListener
{
    public function __construct(private CommandBus $commands) {}

    public function maintenanceScope(): string
    {
        return InterruptStuckTurnsCommand::MAINTENANCE_SCOPE;
    }

    public function __invoke(EngineTicked $event): void
    {
        $this->commands->run(new InterruptStuckTurnsCommand());
    }
}
