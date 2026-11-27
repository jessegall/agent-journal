<?php

declare(strict_types=1);

namespace App\Hosts\Commands\ReadFolderUse;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\Protocol\HostInstructions;
use App\Hosts\Protocol\Payloads\HostFolderPlanPayload;
use App\Values\HostInstructionSource;

/**
 * Makes the host's FolderUse instruction once for its operation and answers the instruction's id.
 */
final readonly class ReadFolderUseHandler implements CommandHandler
{
    public function __construct(private HostInstructions $instructions) {}

    public function handle(ReadFolderUseCommand $command): string
    {
        return $this->instructions->folderUse(
            $command->hostId,
            HostInstructionSource::keyed("folder:use:{$command->operation}"),
            HostFolderPlanPayload::from(['folder' => $command->folder, 'operation' => $command->operation]),
        )->getKey();
    }
}
