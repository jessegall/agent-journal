<?php

declare(strict_types=1);

namespace App\Processes\Commands\IssueEvidencePermit;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use App\Processes\Support\EvidenceRuns;
use App\Processes\Values\PermitLimits;

final readonly class IssueEvidencePermitHandler implements CommandHandler
{
    public function __construct(private EvidenceRuns $evidence) {}

    public function handle(IssueEvidencePermitCommand $command): string
    {
        $runner = new ActorIdentity(ActorType::from($command->runnerType), $command->runnerId);

        $limits = new PermitLimits($command->byteCap, $command->secondsCap, $command->minutesValid);

        return $this->evidence->issue($command->line, $command->workingFolder, $runner, $limits)->id;
    }
}
