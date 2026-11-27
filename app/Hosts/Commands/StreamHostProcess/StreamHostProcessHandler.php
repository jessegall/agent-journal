<?php

declare(strict_types=1);

namespace App\Hosts\Commands\StreamHostProcess;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\Protocol\Data\HostStreamPlanData;
use App\Hosts\Protocol\HostOrders;

/**
 * Makes the stream order of a running process, refused to a replaced worker.
 */
final readonly class StreamHostProcessHandler implements CommandHandler
{
    public function __construct(private HostOrders $orders) {}

    public function handle(StreamHostProcessCommand $command): string
    {
        return $this->orders->stream(
            $command->processId,
            $command->source,
            HostStreamPlanData::from(['frames_per_second' => $command->framesPerSecond, 'raw' => $command->isRaw]),
        )->getKey();
    }
}
