<?php

declare(strict_types=1);

namespace App\Hosts\Commands\NotifyHostInventory;

use App\Bus\Contracts\CommandBus;
use App\Bus\Contracts\CommandHandler;
use App\Hosts\Commands\RemoveHostContainer\RemoveHostContainerCommand;
use App\Hosts\Exceptions\HostProtocolUnsupported;
use App\Hosts\HostInstructionPlacement;
use App\Hosts\Protocol\HostProtocolVersion;
use App\Hosts\Protocol\HostRefusal;
use App\Hosts\Protocol\Payloads\HostInventoryProcessPayload;
use App\Models\Hosts\HostInstruction;
use App\Models\Hosts\HostProcess;
use App\Models\Projects\HostDriverImage;
use App\Time\Contracts\ServerClock;

/**
 * After a host started: keeps the processes it still runs, loses the rest, removes containers no live process runs in,
 * and refuses its claimed input instructions, so keys meant before the restart never land after it. A process opened
 * after the host built its inventory is left alone.
 */
final readonly class NotifyHostInventoryHandler implements CommandHandler
{
    public function __construct(
        private HostInstructionPlacement $placement,
        private ServerClock $clock,
        private CommandBus $commands,
    ) {}

    public function handle(NotifyHostInventoryCommand $command): void
    {
        $host = $this->placement->orderingHost($command->hostId);
        $inventory = $command->inventory;

        if ($inventory->protocol !== HostProtocolVersion::CURRENT) {
            throw HostProtocolUnsupported::forHost($host->id, $inventory->protocol);
        }

        $reported = array_column(
            array_map(fn (HostInventoryProcessPayload $process) => [
                $process->processId,
                $process,
            ], $inventory->processes),
            1,
            0,
        );

        $now = $this->clock->now();
        $host->recordCapabilities($inventory->capabilities);
        $host->forgetAllowedImages();

        // A restarted host holds no allow and no check it had in flight, so every image of it is allowed again.
        foreach (HostDriverImage::findAdmittedOn($host->id) as $image) {
            $image->reallow();
        }
        $host->recordRelease($inventory->release);

        $liveProcesses = HostProcess::findLiveOn($host);

        foreach ($liveProcesses as $process) {
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

        // A container no process still live runs in was left by a crash, a lost answer or a process the journal forgot.
        $stillLive = array_filter($liveProcesses, fn (HostProcess $process) => $process->isLive());
        $heldContainers = array_map(fn (HostProcess $process) => $process->container_name, $stillLive);

        foreach (array_diff($inventory->containers, $heldContainers) as $leftContainer) {
            $this->commands->run(new RemoveHostContainerCommand($host->id, $leftContainer));
        }

        // An instruction the new process cannot carry out again ends here; any other goes to it, answered again from its
        // record.
        foreach (HostInstruction::findClaimedOf($host) as $instruction) {
            if (! $instruction->type->isOfferedAgainAfterRestart()) {
                $instruction->refuse(HostRefusal::HostRestarted, null, [], $now);

                continue;
            }

            $instruction->offerAgain();
        }
    }
}
