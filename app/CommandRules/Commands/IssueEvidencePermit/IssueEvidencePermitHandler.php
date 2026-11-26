<?php

declare(strict_types=1);

namespace App\CommandRules\Commands\IssueEvidencePermit;

use App\Bus\Contracts\CommandHandler;
use App\CommandRules\Values\PermitLimits;
use App\Processes\EvidenceRuns;
use App\Support\ActorReference;

final readonly class IssueEvidencePermitHandler implements CommandHandler
{
    public function __construct(private EvidenceRuns $evidence) {}

    public function handle(IssueEvidencePermitCommand $command): string
    {
        $runner = ActorReference::fromStored($command->runnerType, $command->runnerId);

        $limits = new PermitLimits($command->byteCap, $command->secondsCap, $command->minutesValid);

        return $this->evidence->issue($command->line, $command->workingFolder, $runner, $limits)->getKey();
    }
}
