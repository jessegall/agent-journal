<?php

declare(strict_types=1);

namespace App\Support;

use App\Commands\Navigation\ExpireNavigationRequests\ExpireNavigationRequestsCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Events\EngineListener;
use App\Events\Engine\EngineTicked;

/**
 * Expires the navigation requests nobody answered in time on every engine pass; the sweep is one bounded batch.
 */
final readonly class ExpireNavigationRequestsOnTick implements EngineListener
{
    public function __construct(private CommandBus $commands) {}

    public function maintenanceScope(): string
    {
        return ExpireNavigationRequestsCommand::MAINTENANCE_SCOPE;
    }

    public function __invoke(EngineTicked $event): void
    {
        $this->commands->run(new ExpireNavigationRequestsCommand());
    }
}
