<?php

declare(strict_types=1);

namespace App\Support\Inputs;

use App\Enums\DriverFailure;

/**
 * What a driver's failure notification says, in safe terms: the driver and why its request failed.
 */
final readonly class FailureDetails
{
    public function __construct(
        public string $driver,
        public DriverFailure $failure,
    ) {}
}
