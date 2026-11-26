<?php

declare(strict_types=1);

namespace App\Support\Drivers;

use Carbon\CarbonImmutable;
use Illuminate\Contracts\Cache\Repository;

/**
 * The ask that every driver worker ends between two steps, as on a deploy; a worker started after the ask runs on.
 */
final readonly class DriverRestartSignal
{
    private const string KEY = 'drivers:restart';

    public function __construct(private Repository $cache) {}

    public function ask(CarbonImmutable $at): void
    {
        $this->cache->forever(self::KEY, $at->getTimestampMs());
    }

    public function isAskedSince(CarbonImmutable $started): bool
    {
        return $this->cache->get(self::KEY, 0) >= $started->getTimestampMs();
    }
}
