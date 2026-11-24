<?php

declare(strict_types=1);

namespace App\Events\Engine;

use App\Support\Ticks\ElapsedTime;
use Carbon\CarbonImmutable;

/**
 * One engine pass ran: the time it started and how long since the previous dispatched pass started, or since the
 * engine took its lock for the first pass. It names no frame and no stack.
 */
final readonly class EngineTicked extends EngineEvent
{
    public function __construct(
        public CarbonImmutable $now,
        public ElapsedTime $sincePrevious,
    ) {}
}
