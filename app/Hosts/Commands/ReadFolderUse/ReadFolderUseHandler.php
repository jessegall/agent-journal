<?php

declare(strict_types=1);

namespace App\Hosts\Commands\ReadFolderUse;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\Protocol\HostInstructions;
use App\Hosts\ContainerLabels;
use App\Hosts\Protocol\Payloads\HostContainerLabelPayload;
use App\Values\HostInstructionSource;

/**
 * Asks the host which containers carry the account folder's label once for its operation and answers the instruction's id.
 */
final readonly class ReadFolderUseHandler implements CommandHandler
{
    public function __construct(private HostInstructions $instructions) {}

    public function handle(ReadFolderUseCommand $command): string
    {
        return $this->instructions->listContainers(
            $command->hostId,
            HostInstructionSource::keyed("folder:use:{$command->operation}"),
            HostContainerLabelPayload::from(['name' => ContainerLabels::ACCOUNT, 'value' => $command->folder]),
        )->getKey();
    }
}
