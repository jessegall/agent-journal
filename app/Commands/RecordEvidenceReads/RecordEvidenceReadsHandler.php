<?php

declare(strict_types=1);

namespace App\Commands\RecordEvidenceReads;

use App\Contracts\Bus\CommandHandler;
use App\Models\CommandRules\EvidenceRead;
use App\Models\Runs\ProcessRun;
use App\Support\ActorIdentity;
use App\Values\EvidenceRange;

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
