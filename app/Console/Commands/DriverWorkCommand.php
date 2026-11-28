<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Agents\Drivers\Exceptions\WorkerReportFailed;
use App\Agents\Drivers\Work\DriverWorkers;
use Illuminate\Contracts\Debug\ExceptionHandler;
use Illuminate\Console\Command;

/**
 * Drives one process until its worker is fenced, asked to restart or the process ends.
 */
final class DriverWorkCommand extends Command
{
    /**
     * The longest one step waits for the process's feed, so the lease is renewed in time.
     */
    private const int STEP_WAIT_MILLISECONDS_LIMIT = 3000;

    protected $signature = 'drivers:work {process : the host process to drive}';

    protected $description = 'Drive one host process with its process driver';

    public function handle(DriverWorkers $workers, ExceptionHandler $exceptions): int
    {
        try {
            return $this->drive($workers);
        } catch (WorkerReportFailed $failure) {
            $exceptions->report($failure);
            $this->error($failure->getMessage());

            return self::FAILURE;
        }
    }

    private function drive(DriverWorkers $workers): int
    {
        $work = $workers->begin((string) $this->argument('process'));

        while ($workers->step($work, self::STEP_WAIT_MILLISECONDS_LIMIT)) {
            continue;
        }

        return self::SUCCESS;
    }
}
