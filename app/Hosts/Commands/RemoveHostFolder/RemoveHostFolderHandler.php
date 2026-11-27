<?php

declare(strict_types=1);

namespace App\Hosts\Commands\RemoveHostFolder;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\HostOrderPlacement;
use App\Hosts\Protocol\HostOrderType;
use App\Values\HostOrderSource;

/**
 * Makes the host's RemoveFolder order once for its operation and answers the order's id.
 */
final readonly class RemoveHostFolderHandler implements CommandHandler
{
    public function __construct(private HostOrderPlacement $placement) {}

    public function handle(RemoveHostFolderCommand $command): string
    {
        return $this->placement->forHost(
            $command->hostId,
            HostOrderSource::keyed("folder:remove:{$command->operation}"),
            HostOrderType::RemoveFolder,
            ['folder' => $command->folder, 'operation' => $command->operation],
        )->getKey();
    }
}
