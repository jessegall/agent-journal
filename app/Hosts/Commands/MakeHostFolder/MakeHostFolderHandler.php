<?php

declare(strict_types=1);

namespace App\Hosts\Commands\MakeHostFolder;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\HostOrderPlacement;
use App\Hosts\Protocol\HostOrderType;
use App\Values\HostOrderSource;

/**
 * Makes the host's MakeFolder order once for its operation and answers the order's id.
 */
final readonly class MakeHostFolderHandler implements CommandHandler
{
    public function __construct(private HostOrderPlacement $placement) {}

    public function handle(MakeHostFolderCommand $command): string
    {
        return $this->placement->forHost(
            $command->hostId,
            HostOrderSource::keyed("folder:make:{$command->operation}"),
            HostOrderType::MakeFolder,
            ['folder' => $command->folder, 'operation' => $command->operation],
        )->getKey();
    }
}
