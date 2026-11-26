<?php

declare(strict_types=1);

namespace App\Terminals;

use App\Bus\Contracts\CommandBus;
use App\Contracts\Events\EngineListener;
use App\Events\Engine\EngineTicked;
use App\Terminals\Commands\EndTerminalViews\EndTerminalViewsCommand;

/**
 * Ends lapsed terminal views and those of stopped runtimes on every engine pass; each end is one bounded update, so
 * it needs no throttle.
 */
final readonly class EndTerminalViewsOnTick implements EngineListener
{
    public function __construct(private CommandBus $commands) {}

    public function maintenanceScope(): string
    {
        return EndTerminalViewsCommand::MAINTENANCE_SCOPE;
    }

    public function __invoke(EngineTicked $event): void
    {
        $this->commands->run(new EndTerminalViewsCommand());
    }
}
