<?php

declare(strict_types=1);

namespace App\Processes\Commands\RecordEvidenceReads;

use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use App\Processes\Models\EvidenceRead;
use App\Processes\Models\ProcessRun;
use App\Processes\Values\EvidenceRange;

final readonly class RecordEvidenceReadsHandler implements CommandHandler
{
    public function handle(RecordEvidenceReadsCommand $command): int
    {
        $reader = ActorIdentity::of($command->dispatchedBy());
        $run = ProcessRun::query()->whereKey($command->processRunId)->sole();

        EvidenceRead::createAll(array_map(
            fn (EvidenceRange $range) => EvidenceRead::unsaved($run, $reader, $range),
            $command->ranges,
        ));

        return count($command->ranges);
    }
}
