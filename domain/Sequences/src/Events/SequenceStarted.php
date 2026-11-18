<?php

declare(strict_types=1);

namespace Domain\Sequences\Events;

use App\Agents\Support\StackTarget;
use App\Contracts\Event;

/**
 * A sequence run started for an agent and session, raised inside the transaction that started it.
 */
final readonly class SequenceStarted implements Event
{
    public function __construct(
        public string $runId,
        public StackTarget $target,
    ) {}
}
