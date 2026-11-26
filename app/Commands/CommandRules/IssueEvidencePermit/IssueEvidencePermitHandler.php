<?php

declare(strict_types=1);

namespace App\Commands\CommandRules\IssueEvidencePermit;

use App\Contracts\Bus\CommandHandler;
use App\Support\ActorReference;
use App\Support\EvidenceRuns;
use App\Values\PermitLimits;

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
