<?php

declare(strict_types=1);

namespace App\Hosts\Commands\RemoveHostProcess;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\Protocol\HostInstructions;
use App\Hosts\Protocol\Payloads\HostRemovePlanPayload;
use App\Models\Hosts\HostProcess;
use App\Values\HostInstructionSource;

final readonly class RemoveHostProcessHandler implements CommandHandler
{
    /**
     * How long the container's program has to stop before Docker kills it, when its container is removed.
     */
    private const int STOP_SECONDS = 10;

    public function __construct(private HostInstructions $instructions) {}

    public function handle(RemoveHostProcessCommand $command): string
    {
        $process = HostProcess::findLocked($command->processId);

        return $this->instructions->remove(
            $process->host_id,
            HostInstructionSource::fromJournal(),
            HostRemovePlanPayload::from(['container' => $process->container_name, 'stop_seconds' => self::STOP_SECONDS]),
        )->getKey();
    }
}
