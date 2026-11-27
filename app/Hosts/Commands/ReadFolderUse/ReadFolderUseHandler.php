<?php

declare(strict_types=1);

namespace App\Hosts\Commands\ReadFolderUse;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\Protocol\Data\HostFolderPlanData;
use App\Hosts\Protocol\HostOrders;
use App\Values\HostOrderSource;

/**
 * Makes the host's FolderUse order once for its operation and answers the order's id.
 */
final readonly class ReadFolderUseHandler implements CommandHandler
{
    public function __construct(private HostOrders $orders) {}

    public function handle(ReadFolderUseCommand $command): string
    {
        return $this->orders->folderUse(
            $command->hostId,
            HostOrderSource::keyed("folder:use:{$command->operation}"),
            HostFolderPlanData::from(['folder' => $command->folder, 'operation' => $command->operation]),
        )->getKey();
    }
}
