<?php

declare(strict_types=1);

namespace App\Commands\Hosts\SnapshotHostProcess;

use App\Contracts\Bus\CommandHandler;
use App\Enums\Hosts\HostOrderType;
use App\Support\Hosts\HostOrderPlacement;

/**
 * Makes the snapshot order of a running process, refused to a replaced worker.
 */
final readonly class SnapshotHostProcessHandler implements CommandHandler
{
    public function __construct(private HostOrderPlacement $placement) {}

    public function handle(SnapshotHostProcessCommand $command): string
    {
        return $this->placement->forProcess(
            $command->processId,
            $command->source,
            HostOrderType::Snapshot,
            [],
        )->id;
    }
}
