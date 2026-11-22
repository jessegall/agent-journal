<?php

declare(strict_types=1);

namespace App\Contracts;

/**
 * Ends the process when a pass runs past its time, even inside a blocking call.
 */
interface Watchdog
{
    public function arm(int $seconds): void;

    public function disarm(): void;
}
