<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Time\Sleeper as SleeperContract;

final readonly class Sleeper implements SleeperContract
{
    private const int NANOSECONDS_PER_MICROSECOND = 1_000;

    public function sleep(int $nanoseconds): void
    {
        usleep(intdiv($nanoseconds, self::NANOSECONDS_PER_MICROSECOND));
    }
}
