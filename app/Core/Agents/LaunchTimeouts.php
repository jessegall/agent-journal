<?php

declare(strict_types=1);

namespace App\Core\Agents;

/**
 * How long a launch may stay silent before it is possibly lost, and how long it may stay possibly lost before it is lost.
 */
final readonly class LaunchTimeouts
{
    public function __construct(
        public int $possiblyLostAfterSeconds = 120,
        public int $lostAfterSeconds = 900,
    ) {}
}
