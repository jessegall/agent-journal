<?php

declare(strict_types=1);

namespace App\Hosts\Commands\ResizeHostProcess;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\Protocol\Data\HostTerminalSizeData;
use App\Hosts\Protocol\HostOrders;

/**
 * Makes the resize order of a running process, refused to a replaced worker.
 */
final readonly class ResizeHostProcessHandler implements CommandHandler
{
    public function __construct(private HostOrders $orders) {}

    public function handle(ResizeHostProcessCommand $command): string
    {
        return $this->orders->resize(
            $command->processId,
            $command->source,
            HostTerminalSizeData::from(['columns' => $command->columns, 'rows' => $command->rows]),
        )->getKey();
    }
}
