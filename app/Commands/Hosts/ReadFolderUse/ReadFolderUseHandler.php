<?php

declare(strict_types=1);

namespace App\Commands\Hosts\ReadFolderUse;

use App\Contracts\Bus\CommandHandler;
use App\Enums\Hosts\HostOrderType;
use App\Support\Hosts\HostOrderPlacement;
use App\Values\HostOrderSource;

/**
 * Makes the host's FolderUse order once for its operation and answers the order's id.
 */
final readonly class ReadFolderUseHandler implements CommandHandler
{
    public function __construct(private HostOrderPlacement $placement) {}

    public function handle(ReadFolderUseCommand $command): string
    {
        return $this->placement->forHost(
            $command->hostId,
            HostOrderSource::keyed("folder:use:{$command->operation}"),
            HostOrderType::FolderUse,
            ['folder' => $command->folder, 'operation' => $command->operation],
        )->getKey();
    }
}
