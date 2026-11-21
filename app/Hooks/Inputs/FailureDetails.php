<?php

declare(strict_types=1);

namespace App\Hooks\Inputs;

use App\Agents\Enums\DriverFailure;

/**
 * What a program's failure notification says, in safe terms: the program and why its request failed.
 */
final readonly class FailureDetails
{
    public function __construct(
        public string $driver,
        public DriverFailure $failure,
    ) {}
}
