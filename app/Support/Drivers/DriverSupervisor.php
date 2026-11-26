<?php

declare(strict_types=1);

namespace App\Support\Drivers;

use App\Contracts\Time\ServerClock;
use App\Models\Hosts\HostProcess;
use Illuminate\Contracts\Process\InvokedProcess;
use Illuminate\Process\Factory;

/**
 * Starts a worker for each live process a program driver drives and no worker holds; a worker it started and that
 * still runs is left to its lease.
 */
final class DriverSupervisor
{
    /**
     * @var array<string, InvokedProcess>
     */
    private array $workers = [];

    public function __construct(
        private readonly ProgramDrivers $drivers,
        private readonly Factory $processes,
        private readonly ServerClock $clock,
    ) {}

    /**
     * Starts the workers needed now and answers the processes they drive.
     *
     * @return list<string>
     */
    public function startNeeded(): array
    {
        $needing = HostProcess::query()
            ->needingWorker($this->clock->now())
            ->ofPurposes($this->drivers->purposes())
            ->readAll('every live process of a driven purpose that no worker holds gets one')
            ->pluck('id')
            ->all();

        $started = [];

        foreach ($needing as $processId) {
            if (isset($this->workers[$processId]) && $this->workers[$processId]->running()) {
                continue;
            }

            $this->workers[$processId] = $this->processes->path(base_path())
                ->forever()
                ->start(['php', 'artisan', 'drivers:work', $processId]);

            $started[] = $processId;
        }

        return $started;
    }
}
