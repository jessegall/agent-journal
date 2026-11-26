<?php

declare(strict_types=1);

namespace App\Processes\Contracts;

/**
 * Ends the process when a pass runs past its time, even inside a blocking call.
 */
interface Watchdog
{
    /**
     * Ends the process if it is not disarmed within the seconds.
     */
    public function arm(int $seconds): void;

    /**
     * Calls off the watchdog armed before.
     */
    public function disarm(): void;
}
