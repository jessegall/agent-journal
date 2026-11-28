<?php

declare(strict_types=1);

namespace App\Hosts\Commands\RemoveSessionContainer;

use App\Bus\Contracts\CommandBus;
use App\Bus\Contracts\CommandHandler;
use App\Hosts\Commands\RemoveSessionNetwork\RemoveSessionNetworkCommand;
use App\Hosts\HelperRuns;
use App\Hosts\Protocol\HostInstructions;
use App\Hosts\Protocol\Payloads\HostContainerRunsPayload;
use App\Values\HostInstructionSource;

final readonly class RemoveSessionContainerHandler implements CommandHandler
{
    public function __construct(
        private HostInstructions $instructions,
        private HelperRuns $runs,
        private CommandBus $commands,
    ) {}

    public function handle(RemoveSessionContainerCommand $command): string
    {
        $this->instructions->runContainers(
            $command->hostId,
            HostInstructionSource::fromJournal(),
            HostContainerRunsPayload::from(['runs' => [$this->runs->sessionFilesRemove($command->sessionId)]]),
        );

        return $this->commands->run(new RemoveSessionNetworkCommand($command->hostId, $command->sessionId));
    }
}
