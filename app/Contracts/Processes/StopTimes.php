<?php

declare(strict_types=1);

namespace App\Contracts\Processes;

interface StopTimes
{
    /**
     * The stop time for the monotonic moment in nanoseconds.
     */
    public function at(int $nanoseconds): StopTime;
}
