<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Agents\Drivers\Work\DriverSupervisor;
use App\Support\Hosts\HostWake;
use Illuminate\Console\Command;

/**
 * Keeps a worker on every process a process driver drives: it looks again whenever a process changes, or when the
 * first lease of a driven process could have ended; no timer of its own.
 */
final class DriverSuperviseCommand extends Command
{
    protected $signature = 'drivers:supervise {--once : look once and end}';

    protected $description = 'Start a driver worker for every process that needs one';

    public function handle(DriverSupervisor $supervisor, HostWake $wake): int
    {
        do {
            $supervisor->startNeeded();

            if ($this->option('once') === true) {
                return self::SUCCESS;
            }

            $wake->waitForSupervisor($supervisor->secondsUntilNextLeaseEnd());
        } while (true);
    }
}
