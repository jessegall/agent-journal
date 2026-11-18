<?php

declare(strict_types=1);

namespace Tests\Support\TimeLimits;

use Attribute;

/**
 * Lets a test, or every test of a class, run longer than the default second, for a stated reason such as a lock
 * timeout it waits out or a child process it starts.
 */
#[Attribute(Attribute::TARGET_CLASS | Attribute::TARGET_METHOD)]
final readonly class TimeLimit
{
    public function __construct(public int $seconds, public string $reason) {}
}
