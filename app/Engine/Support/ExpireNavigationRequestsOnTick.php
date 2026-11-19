<?php

declare(strict_types=1);

namespace App\Engine\Support;

use App\Bus\Contracts\CommandBus;
use App\Engine\Commands\ExpireNavigationRequests;
use App\Engine\Contracts\EngineListener;
use App\Engine\Events\EngineTicked;

/**
 * Expires the navigation requests nobody answered in time on every engine pass; the sweep is one bounded batch.
 */
final readonly class ExpireNavigationRequestsOnTick implements EngineListener
{
    public function __construct(private CommandBus $commands) {}

    public function maintenanceScope(): string
    {
        return ExpireNavigationRequests::MAINTENANCE_SCOPE;
    }

    public function __invoke(EngineTicked $event): void
    {
        $this->commands->run(new ExpireNavigationRequests());
    }
}
