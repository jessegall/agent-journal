<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Contracts\ServerClock;
use Carbon\CarbonImmutable;

/**
 * A server clock that reads the time a test set last.
 */
final class FakeServerClock implements ServerClock
{
    public function __construct(private CarbonImmutable $time) {}

    public function now(): CarbonImmutable
    {
        return $this->time;
    }

    public function set(CarbonImmutable $time): void
    {
        $this->time = $time;
    }
}
