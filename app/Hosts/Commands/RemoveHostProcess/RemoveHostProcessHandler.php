<?php

declare(strict_types=1);

namespace App\Hosts\Commands\RemoveHostProcess;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\Protocol\Data\HostRemovePlanData;
use App\Hosts\Protocol\HostOrders;
use App\Models\Hosts\HostProcess;
use App\Values\HostOrderSource;

final readonly class RemoveHostProcessHandler implements CommandHandler
{
    public function __construct(private HostOrders $orders) {}

    public function handle(RemoveHostProcessCommand $command): string
    {
        $process = HostProcess::findLocked($command->processId);

        return $this->orders->remove(
            $process->host_id,
            HostOrderSource::fromJournal(),
            HostRemovePlanData::from(['container' => $process->containerName()]),
        )->getKey();
    }
}
