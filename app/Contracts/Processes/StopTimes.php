<?php

declare(strict_types=1);

namespace App\Contracts\Processes;

interface StopTimes
{
    public function at(int $nanoseconds): StopTime;
}
