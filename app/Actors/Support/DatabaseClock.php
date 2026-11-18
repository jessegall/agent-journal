<?php

declare(strict_types=1);

namespace App\Actors\Support;

use Carbon\CarbonImmutable;
use Illuminate\Database\ConnectionInterface;

/**
 * The database server's own time, so every heartbeat and every freshness check reads one clock.
 */
final readonly class DatabaseClock
{
    public function __construct(private ConnectionInterface $database) {}

    public function now(): CarbonImmutable
    {
        return CarbonImmutable::parse((string) $this->database->scalar('select clock_timestamp()'));
    }
}
