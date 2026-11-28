<?php

declare(strict_types=1);

namespace App\Hosts\Commands\RemoveSessionNetwork;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\ArrangementSetting;
use App\Hosts\Protocol\HostInstructions;
use App\Hosts\Protocol\Payloads\HostNetworkRemovalPayload;
use App\Values\HostInstructionSource;

final readonly class RemoveSessionNetworkHandler implements CommandHandler
{
    public function __construct(private HostInstructions $instructions, private ArrangementSetting $arrangement) {}

    public function handle(RemoveSessionNetworkCommand $command): string
    {
        return $this->instructions->removeNetwork(
            $command->hostId,
            HostInstructionSource::fromJournal(),
            HostNetworkRemovalPayload::from(['network' => $this->arrangement->sessionContainerName($command->sessionId)]),
        )->getKey();
    }
}
