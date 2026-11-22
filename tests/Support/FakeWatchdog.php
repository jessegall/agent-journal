<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Contracts\Processes\Watchdog;

/**
 * Keeps whether it is armed and how often it was armed, and never ends the process.
 */
final class FakeWatchdog implements Watchdog
{
    public int $armings = 0;

    public bool $armed = false;

    public function arm(int $seconds): void
    {
        $this->armings++;
        $this->armed = true;
    }

    public function disarm(): void
    {
        $this->armed = false;
    }
}
