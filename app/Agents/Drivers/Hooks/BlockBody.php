<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Hooks;

use App\Enums\Drivers\DriverStopDecision;
use Spatie\LaravelData\Data;

/**
 * A reply that blocks: a held stop asks the driver to go on, a blocked prompt is not sent. It carries the one reason
 * the agent reads.
 */
final class BlockBody extends Data
{
    public function __construct(
        public readonly DriverStopDecision $decision,
        public readonly string $reason,
    ) {}
}
