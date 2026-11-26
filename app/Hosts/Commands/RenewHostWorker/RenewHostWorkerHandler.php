<?php

declare(strict_types=1);

namespace App\Hosts\Commands\RenewHostWorker;

use App\Bus\Contracts\CommandHandler;
use App\Models\Hosts\HostProcess;
use App\Time\Contracts\ServerClock;

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
