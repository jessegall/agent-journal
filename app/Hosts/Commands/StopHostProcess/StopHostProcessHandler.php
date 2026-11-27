<?php

declare(strict_types=1);

namespace App\Hosts\Commands\StopHostProcess;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\Protocol\HostInstructions;
use App\Hosts\Protocol\Payloads\HostStopPlanPayload;

/**
 * Makes the stop instruction of a running process, refused to a replaced worker.
 */
final readonly class StopHostProcessHandler implements CommandHandler
{
    public function __construct(private HostInstructions $instructions) {}

    public function handle(StopHostProcessCommand $command): string
    {
        return $this->instructions->stop(
            $command->processId,
            $command->source,
            HostStopPlanPayload::from(['grace_ms' => $command->graceMs, 'force_ms' => $command->forceMs]),
        )->getKey();
    }
}
