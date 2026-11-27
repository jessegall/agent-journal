<?php

declare(strict_types=1);

namespace App\Hosts\Commands\RemoveHostFolder;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\Protocol\HostInstructions;
use App\Hosts\Protocol\Payloads\HostFolderPlanPayload;
use App\Values\HostInstructionSource;

/**
 * Makes the host's RemoveFolder instruction once for its operation and answers the instruction's id.
 */
final readonly class RemoveHostFolderHandler implements CommandHandler
{
    public function __construct(private HostInstructions $instructions) {}

    public function handle(RemoveHostFolderCommand $command): string
    {
        return $this->instructions->removeFolder(
            $command->hostId,
            HostInstructionSource::keyed("folder:remove:{$command->operation}"),
            HostFolderPlanPayload::from(['folder' => $command->folder, 'operation' => $command->operation]),
        )->getKey();
    }
}
