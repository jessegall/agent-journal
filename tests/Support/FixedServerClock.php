<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Contracts\ServerClock;
use Carbon\CarbonImmutable;

/**
 * A server clock that always reads the time it was given, for tests that run no query.
 */
final readonly class FixedServerClock implements ServerClock
{
    public function __construct(private CarbonImmutable $time) {}

    public function now(): CarbonImmutable
    {
        return $this->time;
    }
}
