<?php

declare(strict_types=1);

namespace App\Hosts\Commands\ClaimHostWorker;

use App\Bus\Contracts\CommandHandler;
use App\Models\Hosts\HostProcess;
use App\Time\Contracts\ServerClock;

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
