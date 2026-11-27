<?php

declare(strict_types=1);

namespace App\Hosts\Commands\MakeHostFolder;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\HelperRuns;
use App\Hosts\Protocol\HostInstructions;
use App\Hosts\Protocol\Payloads\HostContainerRunsPayload;
use App\Values\HostInstructionSource;

/**
 * Has the host run the making of the account folder once for its operation and answers the instruction's id.
 */
final readonly class MakeHostFolderHandler implements CommandHandler
{
    public function __construct(private HostInstructions $instructions, private HelperRuns $runs) {}

    public function handle(MakeHostFolderCommand $command): string
    {
        return $this->instructions->runContainers(
            $command->hostId,
            HostInstructionSource::keyed("folder:make:{$command->operation}"),
            HostContainerRunsPayload::from(['runs' => [$this->runs->accountFolderMake($command->folder, $command->operation)]]),
        )->getKey();
    }
}
