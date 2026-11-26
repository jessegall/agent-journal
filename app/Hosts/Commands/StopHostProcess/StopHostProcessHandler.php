<?php

declare(strict_types=1);

namespace App\Hosts\Commands\StopHostProcess;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\Enums\HostOrderType;
use App\Hosts\HostOrderPlacement;

/**
 * Makes the stop order of a running process, refused to a replaced worker.
 */
final readonly class StopHostProcessHandler implements CommandHandler
{
    public function __construct(private HostOrderPlacement $placement) {}

    public function handle(StopHostProcessCommand $command): string
    {
        return $this->placement->forProcess(
            $command->processId,
            $command->source,
            HostOrderType::Stop,
            ['grace_ms' => $command->graceMs, 'force_ms' => $command->forceMs],
        )->getKey();
    }
}
