<?php

declare(strict_types=1);

namespace App\Hosts\Commands\SignalHostProcess;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\Protocol\Data\HostSignalPlanData;
use App\Hosts\Protocol\HostOrders;

/**
 * Makes the signal order of a running process, refused to a replaced worker.
 */
final readonly class SignalHostProcessHandler implements CommandHandler
{
    public function __construct(private HostOrders $orders) {}

    public function handle(SignalHostProcessCommand $command): string
    {
        return $this->orders->signal(
            $command->processId,
            $command->source,
            HostSignalPlanData::from(['signal' => $command->signal]),
        )->getKey();
    }
}
