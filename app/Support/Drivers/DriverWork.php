<?php

declare(strict_types=1);

namespace App\Support\Drivers;

use App\Contracts\Drivers\ProcessDriver;
use Carbon\CarbonImmutable;

/**
 * One worker's hold of one process: its generation, its process driver, where it read the process's feed and its
 * runtime's wakes up to, and when it last renewed its lease.
 */
final class DriverWork
{
    /**
     * @param  array<string, string>  $cursors  stream key => cursor
     */
    public function __construct(
        public readonly string $processId,
        public readonly int $generation,
        public readonly ProcessDriver $driver,
        public readonly CarbonImmutable $startedAt,
        private array $cursors,
        private CarbonImmutable $renewedAt,
    ) {}

    /**
     * @return array<string, string>
     */
    public function cursors(): array
    {
        return $this->cursors;
    }

    public function advance(string $stream, string $cursor): void
    {
        $this->cursors[$stream] = $cursor;
    }

    public function isLeaseDue(CarbonImmutable $now): bool
    {
        return $this->renewedAt->diffInMilliseconds($now) >= DriverWorkers::RENEW_MS;
    }

    public function renew(CarbonImmutable $now): void
    {
        $this->renewedAt = $now;
    }
}
