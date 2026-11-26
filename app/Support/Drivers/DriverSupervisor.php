<?php

declare(strict_types=1);

namespace App\Support\Drivers;

use App\Contracts\Time\ServerClock;
use App\Models\Hosts\HostProcess;
use Illuminate\Contracts\Process\InvokedProcess;
use Illuminate\Process\Factory;

/**
 * Starts a worker for each live process a process driver drives and no worker holds; a worker it started and that
 * still runs is left to its lease. It waits for a process to change, or for the first lease that could end.
 */
final class DriverSupervisor
{
    /**
     * The wait that lasts until a wake comes.
     */
    public const int UNTIL_WOKEN = 0;

    /**
     * @var array<string, InvokedProcess>
     */
    private array $workers = [];

    public function __construct(
        private readonly ProcessDrivers $drivers,
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

            $this->workers[$processId] = $this->processes->newPendingProcess()->path(base_path())
                ->forever()
                ->start([
                    'php',
                    'artisan',
                    'drivers:work',
                    $processId,
                ]);

            $started[] = $processId;
        }

        return $started;
    }

    /**
     * How long the supervisor may wait for a process to change: until the first lease of a driven process could end,
     * or for as long as it takes when no worker holds one.
     */
    public function secondsUntilNextLeaseEnd(): int
    {
        $now = $this->clock->now();
        $next = HostProcess::resolveNextLeaseEnd($this->drivers->purposes(), $now);

        if ($next === null) {
            return self::UNTIL_WOKEN;
        }

        return max(1, (int) ceil($now->diffInSeconds($next)));
    }
}
