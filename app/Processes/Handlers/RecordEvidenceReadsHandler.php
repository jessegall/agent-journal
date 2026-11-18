<?php

declare(strict_types=1);

namespace App\Processes\Handlers;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use App\Processes\Commands\RecordEvidenceReads;
use App\Processes\Models\EvidenceRead;
use App\Processes\Models\ProcessRun;

final readonly class RecordEvidenceReadsHandler implements CommandHandler
{
    public function __construct(private CurrentActor $actors) {}

    public function handle(RecordEvidenceReads $command): int
    {
        $reader = ActorIdentity::of($this->actors->actor());
        $run = ProcessRun::query()->whereKey($command->processRunId)->sole();
        foreach ($command->ranges as $range) {
            EvidenceRead::record($run, $reader, $range);
        }

        return count($command->ranges);
    }
}
