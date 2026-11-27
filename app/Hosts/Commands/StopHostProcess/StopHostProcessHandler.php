<?php

declare(strict_types=1);

namespace App\Hosts\Commands\StopHostProcess;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\Protocol\Data\HostStopPlanData;
use App\Hosts\Protocol\HostOrders;

/**
 * Makes the stop order of a running process, refused to a replaced worker.
 */
final readonly class StopHostProcessHandler implements CommandHandler
{
    public function __construct(private HostOrders $orders) {}

    public function handle(StopHostProcessCommand $command): string
    {
        return $this->orders->stop(
            $command->processId,
            $command->source,
            HostStopPlanData::from(['grace_ms' => $command->graceMs, 'force_ms' => $command->forceMs]),
        )->getKey();
    }
}
