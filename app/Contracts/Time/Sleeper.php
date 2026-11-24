<?php

declare(strict_types=1);

namespace App\Contracts\Time;

/**
 * Waits for a while; the engine sleeps through one between its passes.
 */
interface Sleeper
{
    /**
     * Waits for the nanoseconds before going on.
     */
    public function sleep(int $nanoseconds): void;
}
