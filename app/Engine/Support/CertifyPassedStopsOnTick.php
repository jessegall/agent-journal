<?php

declare(strict_types=1);

namespace App\Engine\Support;

use App\Bus\Contracts\CommandBus;
use App\Engine\Contracts\EngineListener;
use App\Engine\Events\EngineTicked;
use App\Hooks\Commands\CertifyPassedStops;

/**
 * Certifies passed stops whose agent never stopped again, on every engine pass; the sweep is bounded.
 */
final readonly class CertifyPassedStopsOnTick implements EngineListener
{
    public function __construct(private CommandBus $commands) {}

    public function maintenanceScope(): string
    {
        return CertifyPassedStops::MAINTENANCE_SCOPE;
    }

    public function __invoke(EngineTicked $event): void
    {
        $this->commands->run(new CertifyPassedStops());
    }
}
