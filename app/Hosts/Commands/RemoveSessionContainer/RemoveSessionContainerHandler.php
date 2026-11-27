<?php

declare(strict_types=1);

namespace App\Hosts\Commands\RemoveSessionContainer;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\ArrangementSetting;
use App\Hosts\Protocol\HostInstructions;
use App\Hosts\Protocol\Payloads\HostSessionRemovalPayload;
use App\Values\HostInstructionSource;

final readonly class RemoveSessionContainerHandler implements CommandHandler
{
    public function __construct(private HostInstructions $instructions, private ArrangementSetting $arrangement) {}

    public function handle(RemoveSessionContainerCommand $command): string
    {
        return $this->instructions->removeSession(
            $command->hostId,
            HostInstructionSource::fromJournal(),
            HostSessionRemovalPayload::from([
                'network' => $this->arrangement->sessionContainerName($command->sessionId),
                'session' => $command->sessionId,
            ]),
        )->getKey();
    }
}
