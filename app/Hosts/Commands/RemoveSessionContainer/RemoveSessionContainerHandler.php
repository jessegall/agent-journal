<?php

declare(strict_types=1);

namespace App\Hosts\Commands\RemoveSessionContainer;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\ArrangementSetting;
use App\Hosts\Protocol\HostInstructions;
use App\Hosts\HelperRuns;
use App\Hosts\Protocol\Payloads\HostContainerRunsPayload;
use App\Hosts\Protocol\Payloads\HostNetworkRemovalPayload;
use App\Values\HostInstructionSource;

final readonly class RemoveSessionContainerHandler implements CommandHandler
{
    public function __construct(
        private HostInstructions $instructions,
        private ArrangementSetting $arrangement,
        private HelperRuns $runs,
    ) {}

    public function handle(RemoveSessionContainerCommand $command): string
    {
        $this->instructions->runContainers(
            $command->hostId,
            HostInstructionSource::fromJournal(),
            HostContainerRunsPayload::from(['runs' => [$this->runs->sessionFilesRemove($command->sessionId)]]),
        );

        return $this->instructions->removeNetwork(
            $command->hostId,
            HostInstructionSource::fromJournal(),
            HostNetworkRemovalPayload::from(['network' => $this->arrangement->sessionContainerName($command->sessionId)]),
        )->getKey();
    }
}
