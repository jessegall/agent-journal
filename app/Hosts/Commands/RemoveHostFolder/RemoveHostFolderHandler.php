<?php

declare(strict_types=1);

namespace App\Hosts\Commands\RemoveHostFolder;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\Protocol\Data\HostFolderPlanData;
use App\Hosts\Protocol\HostOrders;
use App\Values\HostOrderSource;

/**
 * Makes the host's RemoveFolder order once for its operation and answers the order's id.
 */
final readonly class RemoveHostFolderHandler implements CommandHandler
{
    public function __construct(private HostOrders $orders) {}

    public function handle(RemoveHostFolderCommand $command): string
    {
        return $this->orders->removeFolder(
            $command->hostId,
            HostOrderSource::keyed("folder:remove:{$command->operation}"),
            HostFolderPlanData::from(['folder' => $command->folder, 'operation' => $command->operation]),
        )->getKey();
    }
}
