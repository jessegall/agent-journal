<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Time\Sleeper;

final readonly class SystemSleeper implements Sleeper
{
    private const int NANOSECONDS_PER_MICROSECOND = 1_000;

    public function sleep(int $nanoseconds): void
    {
        usleep(intdiv($nanoseconds, self::NANOSECONDS_PER_MICROSECOND));
    }
}
