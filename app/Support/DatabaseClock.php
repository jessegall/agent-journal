<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\ServerClock;
use Carbon\CarbonImmutable;
use Illuminate\Database\ConnectionInterface;

/**
 * The server clock as the database server's own time, so every stored time and every freshness check reads one clock.
 */
final readonly class DatabaseClock implements ServerClock
{
    public function __construct(private ConnectionInterface $database) {}

    public function now(): CarbonImmutable
    {
        return CarbonImmutable::parse((string) $this->database->scalar('select clock_timestamp()'));
    }
}
