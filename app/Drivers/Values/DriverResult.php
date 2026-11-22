<?php

declare(strict_types=1);

namespace App\Drivers\Values;

use App\Drivers\Enums\DriverOutcome;

/**
 * The typed outcome of a driver operation, with the reason the user reads for any outcome but applied.
 */
final readonly class DriverResult
{
    public function __construct(
        public DriverOutcome $outcome,
        public string|null $reason = null,
    ) {}
}
