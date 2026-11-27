<?php

declare(strict_types=1);

namespace App\Hosts\Commands\SignalHostProcess;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\Protocol\HostInstructions;
use App\Hosts\Protocol\Payloads\HostSignalPlanPayload;

/**
 * Makes the signal instruction of a running process, refused to a replaced worker.
 */
final readonly class SignalHostProcessHandler implements CommandHandler
{
    public function __construct(private HostInstructions $instructions) {}

    public function handle(SignalHostProcessCommand $command): string
    {
        return $this->instructions->signal(
            $command->processId,
            $command->source,
            HostSignalPlanPayload::from(['signal' => $command->signal]),
        )->getKey();
    }
}
