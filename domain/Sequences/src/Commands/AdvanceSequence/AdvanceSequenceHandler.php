<?php

declare(strict_types=1);

namespace Domain\Sequences\Commands\AdvanceSequence;

use Domain\Sequences\Commands\Support\SequenceCommandHandler;
use Domain\Sequences\Models\SequenceRun;

/**
 * Advances the run under its row lock.
 */
final readonly class AdvanceSequenceHandler extends SequenceCommandHandler
{
    public function handle(AdvanceSequenceCommand $command): void
    {
        SequenceRun::lockedById($command->sequenceRunId)->advance();
    }
}
