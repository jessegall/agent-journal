<?php

declare(strict_types=1);

namespace App\Processes\Contracts;

interface StopTimes
{
    /**
     * The stop time for the monotonic moment in nanoseconds.
     */
    public function at(int $nanoseconds): StopTime;
}
