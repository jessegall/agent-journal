<?php

declare(strict_types=1);

namespace App\Commands\Hosts\RenewHostWorker;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Time\ServerClock;
use App\Models\Hosts\HostProcess;

/**
 * Extends the worker's lease while its generation is still the process's.
 */
final readonly class RenewHostWorkerHandler implements CommandHandler
{
    public function __construct(private ServerClock $clock) {}

    public function handle(RenewHostWorkerCommand $command): void
    {
        HostProcess::findLocked($command->processId)->renewWorker($command->workerGeneration, $this->clock->now());
    }
}
