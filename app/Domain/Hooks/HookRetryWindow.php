<?php

declare(strict_types=1);

namespace App\Domain\Hooks;

use Carbon\CarbonImmutable;

/**
 * How long after a call was issued a retry of it is still the same call; older or far-future calls are refused.
 */
final readonly class HookRetryWindow
{
    public function __construct(public int $seconds = 300) {}

    public function admits(CarbonImmutable $issuedAt, CarbonImmutable $now): bool
    {
        return abs($now->getTimestamp() - $issuedAt->getTimestamp()) <= $this->seconds;
    }
}
