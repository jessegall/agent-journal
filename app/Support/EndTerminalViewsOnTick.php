<?php

declare(strict_types=1);

namespace App\Support;

use App\Commands\Terminals\EndTerminalViews\EndTerminalViewsCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Events\EngineListener;
use App\Events\Engine\EngineTicked;

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
