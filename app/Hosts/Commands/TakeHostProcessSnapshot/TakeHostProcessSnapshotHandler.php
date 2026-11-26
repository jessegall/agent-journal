<?php

declare(strict_types=1);

namespace App\Hosts\Commands\TakeHostProcessSnapshot;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\Enums\HostOrderType;
use App\Hosts\HostOrderPlacement;

/**
 * Makes the snapshot order of a running process, refused to a replaced worker.
 */
final readonly class TakeHostProcessSnapshotHandler implements CommandHandler
{
    public function __construct(private HostOrderPlacement $placement) {}

    public function handle(TakeHostProcessSnapshotCommand $command): string
    {
        return $this->placement->forProcess(
            $command->processId,
            $command->source,
            HostOrderType::Snapshot,
            [],
        )->getKey();
    }
}
