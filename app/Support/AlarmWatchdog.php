<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Processes\Watchdog;

/**
 * The process alarm: SIGALRM keeps its default disposition, which terminates the process, because a PHP handler may
 * never run inside a blocking call. No handler for SIGALRM may be installed anywhere in the engine.
 */
final readonly class AlarmWatchdog implements Watchdog
{
    public function arm(int $seconds): void
    {
        pcntl_alarm($seconds);
    }

    public function disarm(): void
    {
        pcntl_alarm(0);
    }
}
