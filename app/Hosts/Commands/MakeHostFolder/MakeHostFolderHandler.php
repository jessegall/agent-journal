<?php

declare(strict_types=1);

namespace App\Hosts\Commands\MakeHostFolder;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\Protocol\Data\HostFolderPlanData;
use App\Hosts\Protocol\HostOrders;
use App\Values\HostOrderSource;

/**
 * Makes the host's MakeFolder order once for its operation and answers the order's id.
 */
final readonly class MakeHostFolderHandler implements CommandHandler
{
    public function __construct(private HostOrders $orders) {}

    public function handle(MakeHostFolderCommand $command): string
    {
        return $this->orders->makeFolder(
            $command->hostId,
            HostOrderSource::keyed("folder:make:{$command->operation}"),
            HostFolderPlanData::from(['folder' => $command->folder, 'operation' => $command->operation]),
        )->getKey();
    }
}
