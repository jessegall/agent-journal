<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Support\Drivers\DriverSupervisor;
use App\Support\Hosts\HostWake;
use Illuminate\Console\Command;

/**
 * Keeps a worker on every process a program driver drives: it looks again whenever a process changes, and at the
 * latest once a lease could have ended.
 */
final class DriverSuperviseCommand extends Command
{
    /**
     * The longest the supervisor waits before it looks again, shorter than a worker's lease.
     */
    private const int LOOK_SECONDS = 5;

    protected $signature = 'drivers:supervise {--once : look once and end}';

    protected $description = 'Start a driver worker for every process that needs one';

    public function handle(DriverSupervisor $supervisor, HostWake $wake): int
    {
        do {
            $supervisor->startNeeded();

            if ($this->option('once') === true) {
                return self::SUCCESS;
            }

            $wake->waitForSupervisor(self::LOOK_SECONDS);
        } while (true);
    }
}
