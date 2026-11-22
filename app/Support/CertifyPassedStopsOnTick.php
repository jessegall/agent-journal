<?php

declare(strict_types=1);

namespace App\Support;

use App\Commands\CertifyPassedStops\CertifyPassedStopsCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Events\EngineListener;
use App\Events\EngineTicked;

/**
 * Certifies passed stops whose agent never stopped again, on every engine pass; the sweep is bounded.
 */
final readonly class CertifyPassedStopsOnTick implements EngineListener
{
    public function __construct(private CommandBus $commands) {}

    public function maintenanceScope(): string
    {
        return CertifyPassedStopsCommand::MAINTENANCE_SCOPE;
    }

    public function __invoke(EngineTicked $event): void
    {
        $this->commands->run(new CertifyPassedStopsCommand());
    }
}
