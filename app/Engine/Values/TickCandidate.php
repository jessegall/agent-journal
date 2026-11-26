<?php

declare(strict_types=1);

namespace App\Engine\Values;

use App\Contracts\Work\TickableState;
use App\Support\References\WorkOccurrence;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;

/**
 * One frame the engine may tick this pass: its stack as stored at selection, the frame, when it entered, and its
 * restored ticking state.
 */
final readonly class TickCandidate
{
    public function __construct(
        public StackTarget $target,
        public string $stackId,
        public int $stackVersion,
        public string $frameId,
        public int $position,
        public CarbonImmutable $enteredAt,
        public TickableState $state,
        public WorkOccurrence $occurrence,
    ) {}
}
