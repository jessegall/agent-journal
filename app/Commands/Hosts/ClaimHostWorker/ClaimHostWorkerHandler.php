<?php

declare(strict_types=1);

namespace App\Commands\Hosts\ClaimHostWorker;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Time\ServerClock;
use App\Models\Hosts\HostProcess;

/**
 * Raises the process's worker generation and starts the new worker's lease.
 */
final readonly class ClaimHostWorkerHandler implements CommandHandler
{
    public function __construct(private ServerClock $clock) {}

    public function handle(ClaimHostWorkerCommand $command): int
    {
        return HostProcess::findLocked($command->processId)->claimWorker($this->clock->now());
    }
}
