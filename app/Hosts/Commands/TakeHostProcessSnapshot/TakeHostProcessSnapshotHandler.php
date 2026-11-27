<?php

declare(strict_types=1);

namespace App\Hosts\Commands\TakeHostProcessSnapshot;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\Protocol\HostOrders;

/**
 * Makes the snapshot order of a running process, refused to a replaced worker.
 */
final readonly class TakeHostProcessSnapshotHandler implements CommandHandler
{
    public function __construct(private HostOrders $orders) {}

    public function handle(TakeHostProcessSnapshotCommand $command): string
    {
        return $this->orders->snapshot($command->processId, $command->source)->getKey();
    }
}
