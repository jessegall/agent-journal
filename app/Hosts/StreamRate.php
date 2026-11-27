<?php

declare(strict_types=1);

namespace App\Hosts;

/**
 * How many frames a second a terminal process a worker drives streams: at least four, or the faster rate a viewer
 * asks.
 */
final readonly class StreamRate
{
    /**
     * The least a worker driving a terminal reads, so it sees each screen settle in time.
     */
    public const int WORKER_MINIMUM = 4;

    /**
     * The rate of a terminal a worker drives, with the rate a viewer asks beside it.
     */
    public static function withWorker(int $viewerRate): int
    {
        return max(self::WORKER_MINIMUM, $viewerRate);
    }
}
