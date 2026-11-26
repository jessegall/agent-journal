<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Work;

use App\Contracts\Drivers\ProcessDriver;
use Carbon\CarbonImmutable;

/**
 * One worker's hold of one process: its generation, its process driver, where it read the process's feed and its
 * runtime's wakes up to, and when it last renewed its lease.
 */
final class DriverWork
{
    private const int NANOSECONDS_PER_MS = 1_000_000;

    /**
     * @param  array<string, string>  $cursors  stream key => cursor
     */
    public function __construct(
        public readonly string $processId,
        public readonly int $generation,
        public readonly ProcessDriver $driver,
        public readonly CarbonImmutable $startedAt,
        private array $cursors,
        private int $renewedAtNanoseconds,
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

    /**
     * Whether the worker's lease is due again, by the process's own clock, so a step asks the database nothing.
     */
    public function isLeaseDue(int $nanoseconds): bool
    {
        return $nanoseconds - $this->renewedAtNanoseconds >= DriverWorkers::RENEW_MS * self::NANOSECONDS_PER_MS;
    }

    public function renew(int $nanoseconds): void
    {
        $this->renewedAtNanoseconds = $nanoseconds;
    }
}
