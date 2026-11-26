<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Agents\Drivers\Work\DriverRestartSignal;
use App\Time\Contracts\ServerClock;
use Illuminate\Console\Command;

/**
 * Asks every running driver worker to end between two steps, so the supervisor starts it again on the new code.
 */
final class DriverRestartCommand extends Command
{
    protected $signature = 'drivers:restart';

    protected $description = 'Ask every driver worker to end between two steps';

    public function handle(DriverRestartSignal $restart, ServerClock $clock): int
    {
        $restart->ask($clock->now());

        return self::SUCCESS;
    }
}
