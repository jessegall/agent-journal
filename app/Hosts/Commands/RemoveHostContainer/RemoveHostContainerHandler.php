<?php

declare(strict_types=1);

namespace App\Hosts\Commands\RemoveHostContainer;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\Protocol\HostInstructions;
use App\Hosts\Protocol\Payloads\HostRemovePlanPayload;
use App\Values\HostInstructionSource;

final readonly class RemoveHostContainerHandler implements CommandHandler
{
    /**
     * How long the container's program has to stop before Docker kills it, when its container is removed.
     */
    private const int STOP_SECONDS = 10;

    public function __construct(private HostInstructions $instructions) {}

    public function handle(RemoveHostContainerCommand $command): string
    {
        return $this->instructions->remove(
            $command->hostId,
            HostInstructionSource::fromJournal(),
            HostRemovePlanPayload::from(['container' => $command->container, 'stop_seconds' => self::STOP_SECONDS]),
        )->getKey();
    }
}
