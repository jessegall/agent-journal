<?php

declare(strict_types=1);

namespace App\Hosts\Commands\StreamHostProcess;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\HostOrderPlacement;
use App\Hosts\Protocol\HostOrderType;

/**
 * Makes the stream order of a running process, refused to a replaced worker.
 */
final readonly class StreamHostProcessHandler implements CommandHandler
{
    public function __construct(private HostOrderPlacement $placement) {}

    public function handle(StreamHostProcessCommand $command): string
    {
        return $this->placement->forProcess(
            $command->processId,
            $command->source,
            HostOrderType::Stream,
            ['frames_per_second' => $command->framesPerSecond, 'raw' => $command->isRaw],
        )->getKey();
    }
}
