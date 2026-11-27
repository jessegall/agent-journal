<?php

declare(strict_types=1);

namespace App\Hosts\Commands\NotifyHostInventory;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\Data\HostInventoryData;
use App\Hosts\Data\InventoryProcessData;
use App\Hosts\Enums\HostRefusal;
use App\Hosts\Exceptions\HostProtocolUnsupported;
use App\Hosts\HostOrderPlacement;
use App\Models\Hosts\HostOrder;
use App\Models\Hosts\HostProcess;
use App\Time\Contracts\ServerClock;

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

        if ($inventory->protocol !== HostOrderPlacement::PROTOCOL) {
            throw HostProtocolUnsupported::forHost($host->id, $inventory->protocol);
        }

        $reported = array_column(
            array_map(fn (InventoryProcessData $process) => [
                $process->processId,
                $process,
            ], $inventory->processes),
            1,
            0,
        );

        $now = $this->clock->now();
        $host->recordCapabilities($inventory->capabilities);
        $host->forgetAllowedImages();
        $host->recordRelease($inventory->release);

        foreach (HostProcess::findLiveOn($host) as $process) {
            $held = $reported[$process->id] ?? null;

            if ($held === null && $process->isOpenedBy($inventory->answeredThrough)) {
                $process->lose('the host restarted without it', $now);
            }

            if ($held !== null && ! $held->isAlive) {
                $process->lose('the host restarted and holds it no longer running', $now);
            }

            if ($held?->isAlive === true && $process->hasLostOutputOf($held->spoolOffset)) {
                $process->lose('the host restarted without the output it had already sent', $now);
            }
        }

        // An order the new process cannot carry out again ends here; any other goes to it, answered again from its record.
        foreach (HostOrder::findClaimedOf($host) as $order) {
            if (! $order->type->isOfferedAgainAfterRestart()) {
                $order->refuse(HostRefusal::HostRestarted, [], $now);

                continue;
            }

            $order->offerAgain();
        }
    }
}
