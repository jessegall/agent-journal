<?php

declare(strict_types=1);

namespace App\Hosts\Commands\StreamHostProcess;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\Protocol\HostInstructions;
use App\Hosts\Protocol\Payloads\HostStreamPlanPayload;

/**
 * Makes the stream instruction of a running process, refused to a replaced worker.
 */
final readonly class StreamHostProcessHandler implements CommandHandler
{
    public function __construct(private HostInstructions $instructions) {}

    public function handle(StreamHostProcessCommand $command): string
    {
        return $this->instructions->stream(
            $command->processId,
            $command->source,
            HostStreamPlanPayload::from(['frames_per_second' => $command->framesPerSecond, 'raw' => $command->isRaw]),
        )->getKey();
    }
}
