<?php

declare(strict_types=1);

namespace App\Commands\CommandRules\RecordEvidenceReads;

use App\Contracts\Bus\CommandHandler;
use App\Models\CommandRules\EvidenceRead;
use App\Models\Runs\ProcessRun;

final readonly class RecordEvidenceReadsHandler implements CommandHandler
{
    public function handle(RecordEvidenceReadsCommand $command): int
    {
        $reader = $command->dispatchedBy();
        $run = ProcessRun::query()->whereKey($command->processRunId)->sole();

        EvidenceRead::createMany($run, $reader, $command->ranges);

        return count($command->ranges);
    }
}
