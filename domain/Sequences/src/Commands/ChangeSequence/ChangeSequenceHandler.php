<?php

declare(strict_types=1);

namespace Domain\Sequences\Commands\ChangeSequence;

use Domain\Sequences\Commands\Support\SequenceCommandHandler;
use Domain\Sequences\Exceptions\SequenceChangedMeanwhile;
use Domain\Sequences\Models\Sequence;

final readonly class ChangeSequenceHandler extends SequenceCommandHandler
{
    public function handle(ChangeSequenceCommand $command): void
    {
        $sequence = Sequence::findLockedById($command->sequenceId);

        if ($sequence->version !== $command->openedVersion) {
            throw SequenceChangedMeanwhile::since($command->openedVersion, $sequence->version);
        }

        $sequence->change($command->name, $sequence->summary, $command->steps);
    }
}
