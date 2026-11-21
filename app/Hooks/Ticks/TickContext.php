<?php

declare(strict_types=1);

namespace App\Hooks\Ticks;

use App\Agents\Values\StackTarget;
use Carbon\CarbonImmutable;

/**
 * What a ticking state is told: the time of this tick, the time since its last settled tick (never null), when its
 * frame entered the stack, and the stack it sits on.
 */
final readonly class TickContext
{
    public function __construct(
        public CarbonImmutable $now,
        public ElapsedTime $delta,
        public CarbonImmutable $enteredAt,
        public StackTarget $target,
    ) {}
}
