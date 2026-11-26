<?php

declare(strict_types=1);

namespace App\Support\Hosts;

/**
 * How many frames a second a terminal process streams, worked out in this one place from who reads them: a worker
 * driving it needs at least four, a viewer the rate its view asks, and with neither nothing leaves the machine.
 */
final readonly class StreamRate
{
    /**
     * The least a worker driving a terminal reads, so it sees each screen settle in time.
     */
    public const int WORKER_MINIMUM = 4;

    public static function of(bool $hasWorker, int $viewerRate): int
    {
        return $hasWorker ? max(self::WORKER_MINIMUM, $viewerRate) : max(0, $viewerRate);
    }
}
