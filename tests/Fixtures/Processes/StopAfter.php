<?php

declare(strict_types=1);

namespace Tests\Fixtures\Processes;

use App\Contracts\Processes\StopSignal;

/**
 * A stop signal for tests that is requested once a number of seconds has passed since it was made.
 */
final readonly class StopAfter implements StopSignal
{
    private float $requestedAt;

    public function __construct(float $seconds, private string $reason = 'stopped by the test')
    {
        $this->requestedAt = microtime(true) + $seconds;
    }

    public function isRequested(): bool
    {
        return microtime(true) >= $this->requestedAt;
    }

    public function reason(): string
    {
        return $this->reason;
    }
}
