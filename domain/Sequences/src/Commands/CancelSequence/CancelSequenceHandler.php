<?php

declare(strict_types=1);

namespace Domain\Sequences\Commands\CancelSequence;

use Domain\Sequences\Commands\Support\SequenceCommandHandler;
use Domain\Sequences\Models\SequenceRun;

/**
 * Cancels the run under its row lock.
 */
final readonly class CancelSequenceHandler extends SequenceCommandHandler
{
    public function handle(CancelSequenceCommand $command): void
    {
        SequenceRun::findLockedById($command->sequenceRunId)->cancel();
    }
}
