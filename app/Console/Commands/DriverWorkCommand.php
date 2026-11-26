<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Support\Drivers\DriverWorkers;
use Illuminate\Console\Command;

/**
 * Drives one process until its worker is fenced, asked to restart or the process ends.
 */
final class DriverWorkCommand extends Command
{
    /**
     * The longest one step waits for the process's feed, so the lease is renewed in time.
     */
    private const int STEP_WAIT_MS = 3000;

    protected $signature = 'drivers:work {process : the host process to drive}';

    protected $description = 'Drive one host process with its process driver';

    public function handle(DriverWorkers $workers): int
    {
        $work = $workers->begin((string) $this->argument('process'));

        while ($workers->step($work, self::STEP_WAIT_MS)) {
            continue;
        }

        return self::SUCCESS;
    }
}
