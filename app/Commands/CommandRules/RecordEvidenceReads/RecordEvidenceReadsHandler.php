<?php

declare(strict_types=1);

namespace App\Commands\CommandRules\RecordEvidenceReads;

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

        EvidenceRead::createMany($run, $reader, $command->ranges);

        return count($command->ranges);
    }
}
