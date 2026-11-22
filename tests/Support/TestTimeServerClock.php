<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Contracts\ServerClock;
use Carbon\CarbonImmutable;

/**
 * A server clock that reads the test's own time, for tests that move time with CarbonImmutable::setTestNow.
 */
final readonly class TestTimeServerClock implements ServerClock
{
    public function now(): CarbonImmutable
    {
        return CarbonImmutable::now();
    }
}
