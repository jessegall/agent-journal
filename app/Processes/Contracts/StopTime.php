<?php

declare(strict_types=1);

namespace App\Processes\Contracts;

/**
 * A fixed moment by which work must stop, read as the time left until it; 0 or less once it has passed.
 */
interface StopTime
{
    /**
     * @phpstan-impure
     */
    public function remainingMilliseconds(): int;
}
