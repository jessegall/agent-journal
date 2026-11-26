<?php

declare(strict_types=1);

namespace App\Hosts\Commands\NotifyHostHeartbeat;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\HostOrderPlacement;
use App\Models\Hosts\HostProcess;
use App\Time\Contracts\ServerClock;

/**
 * Records the host's heartbeat; a live process it leaves out after its open order was answered is missed, and lost
 * the second heartbeat in a row.
 */
final readonly class NotifyHostHeartbeatHandler implements CommandHandler
{
    public function __construct(private HostOrderPlacement $placement, private ServerClock $clock) {}

    public function handle(NotifyHostHeartbeatCommand $command): void
    {
        $host = $this->placement->orderingHost($command->hostId);
        $now = $this->clock->now();
        $host->recordHeartbeat($now);

        foreach (HostProcess::findLiveOn($host) as $process) {
            if (in_array($process->id, $command->liveProcesses, true)) {
                $process->seeInHeartbeat();

                continue;
            }

            if ($process->isOpenedBy($command->answeredThrough)) {
                $process->missInHeartbeat($now);
            }
        }
    }
}
