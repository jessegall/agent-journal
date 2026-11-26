<?php

declare(strict_types=1);

namespace App\CommandRules\Commands\RecordEvidenceReads;

use App\Bus\Contracts\CommandHandler;
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
