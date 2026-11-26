<?php

declare(strict_types=1);

namespace App\Commands\Hosts\StopHostProcess;

use App\Contracts\Bus\CommandHandler;
use App\Enums\Hosts\HostOrderType;
use App\Support\Hosts\HostOrderPlacement;

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
