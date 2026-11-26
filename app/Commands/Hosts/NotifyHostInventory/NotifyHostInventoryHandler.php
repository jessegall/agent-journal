<?php

declare(strict_types=1);

namespace App\Commands\Hosts\NotifyHostInventory;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Time\ServerClock;
use App\Data\Hosts\HostInventoryData;
use App\Data\Hosts\InventoryProcessData;
use App\Enums\Hosts\HostRefusal;
use App\Models\Hosts\HostOrder;
use App\Models\Hosts\HostProcess;
use App\Support\Hosts\HostOrderPlacement;

/**
 * After a host started, keeps each process it still runs, loses each it no longer runs or no longer holds, and
 * refuses every input order it had claimed, since keys meant for the screen before the restart must not land after
 * it. A process opened after the host built its inventory is left alone.
 */
final readonly class NotifyHostInventoryHandler implements CommandHandler
{
    public function __construct(private HostOrderPlacement $placement, private ServerClock $clock) {}

    public function handle(NotifyHostInventoryCommand $command): void
    {
        $host = $this->placement->orderingHost($command->hostId);
        $inventory = HostInventoryData::from(json_decode($command->body, true, flags: JSON_THROW_ON_ERROR));

        $reported = array_column(
            array_map(fn (InventoryProcessData $process) => [$process->processId, $process], $inventory->processes),
            1,
            0,
        );

        $now = $this->clock->now();

        foreach (HostProcess::findLiveOn($host) as $process) {
            $held = $reported[$process->id] ?? null;

            if ($held === null && $process->isOpenedBy($inventory->answeredThrough)) {
                $process->lose('the host restarted without it', $now);
            }

            if ($held !== null && ! $held->isAlive) {
                $process->lose('the host restarted and holds it no longer running', $now);
            }
        }

        foreach (HostOrder::findClaimedInputsOf($host) as $order) {
            $order->refuse(HostRefusal::HostRestarted, [], $now);
        }
    }
}
