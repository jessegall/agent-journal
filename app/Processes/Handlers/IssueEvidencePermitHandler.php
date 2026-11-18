<?php

declare(strict_types=1);

namespace App\Processes\Handlers;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use App\Processes\Commands\IssueEvidencePermit;
use App\Processes\Support\EvidenceRuns;

final readonly class IssueEvidencePermitHandler implements CommandHandler
{
    public function __construct(private EvidenceRuns $evidence) {}

    public function handle(IssueEvidencePermit $command): string
    {
        $runner = new ActorIdentity(ActorType::from($command->runnerType), $command->runnerId);

        return $this->evidence->issue($command->line, $command->workingFolder, $runner, $command->byteCap, $command->secondsCap, $command->minutesValid)->id;
    }
}
