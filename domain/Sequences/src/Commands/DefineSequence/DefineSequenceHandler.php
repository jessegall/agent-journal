<?php

declare(strict_types=1);

namespace Domain\Sequences\Commands\DefineSequence;

use Domain\Sequences\Commands\Support\SequenceCommandHandler;
use Domain\Sequences\Models\Sequence;

final readonly class DefineSequenceHandler extends SequenceCommandHandler
{
    public function handle(DefineSequenceCommand $command): string
    {
        return Sequence::create($command->name, '', $command->steps, $command->owner())->getKey();
    }
}
