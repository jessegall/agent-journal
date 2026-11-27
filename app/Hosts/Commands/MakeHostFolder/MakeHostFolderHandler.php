<?php

declare(strict_types=1);

namespace App\Hosts\Commands\MakeHostFolder;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\Protocol\HostInstructions;
use App\Hosts\Protocol\Payloads\HostFolderPlanPayload;
use App\Values\HostInstructionSource;

/**
 * Makes the host's MakeFolder instruction once for its operation and answers the instruction's id.
 */
final readonly class MakeHostFolderHandler implements CommandHandler
{
    public function __construct(private HostInstructions $instructions) {}

    public function handle(MakeHostFolderCommand $command): string
    {
        return $this->instructions->makeFolder(
            $command->hostId,
            HostInstructionSource::keyed("folder:make:{$command->operation}"),
            HostFolderPlanPayload::from(['folder' => $command->folder, 'operation' => $command->operation]),
        )->getKey();
    }
}
