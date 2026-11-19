<?php

declare(strict_types=1);

namespace App\Engine\Support;

use App\Bus\Contracts\CommandBus;
use App\Engine\Commands\EndTerminalViews;
use App\Engine\Contracts\EngineListener;
use App\Engine\Events\EngineTicked;

/**
 * Ends lapsed terminal views and those of stopped runtimes on every engine pass; each end is one bounded update, so
 * it needs no throttle.
 */
final readonly class EndTerminalViewsOnTick implements EngineListener
{
    public function __construct(private CommandBus $commands) {}

    public function maintenanceScope(): string
    {
        return EndTerminalViews::MAINTENANCE_SCOPE;
    }

    public function __invoke(EngineTicked $event): void
    {
        $this->commands->run(new EndTerminalViews());
    }
}
