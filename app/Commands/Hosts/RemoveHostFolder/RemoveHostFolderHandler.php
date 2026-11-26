<?php

declare(strict_types=1);

namespace App\Commands\Hosts\RemoveHostFolder;

use App\Contracts\Bus\CommandHandler;
use App\Enums\Hosts\HostOrderType;
use App\Support\Hosts\HostOrderPlacement;
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
        )->id;
    }
}
