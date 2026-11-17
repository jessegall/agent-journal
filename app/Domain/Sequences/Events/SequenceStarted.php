<?php

declare(strict_types=1);

namespace App\Domain\Sequences\Events;

use App\Core\Hooks\Storage\StackTarget;

/**
 * A sequence run started for an agent and session, raised inside the transaction that started it.
 */
final readonly class SequenceStarted
{
    public function __construct(
        public int $runId,
        public StackTarget $target,
    ) {}
}
