<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Programs;

use Spatie\LaravelData\Data;

/**
 * A stop reply that asks the program to go on, with the one reason the agent reads. An allowed stop sends an empty object instead.
 */
final class StopBody extends Data
{
    public function __construct(
        public readonly NativeStopDecision $decision,
        public readonly string $reason,
    ) {}
}
