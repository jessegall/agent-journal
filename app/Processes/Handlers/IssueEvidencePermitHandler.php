<?php

declare(strict_types=1);

namespace App\Processes\Handlers;

use App\Actors\Contracts\CurrentAuthorizer;
use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use App\Processes\Commands\IssueEvidencePermit;
use App\Processes\Enums\ProcessAbility;
use App\Processes\Models\CommandRequest;
use App\Processes\Policies\ProcessAdministrationPolicy;
use App\Processes\Support\EvidenceRuns;
use App\Processes\Values\PermitLimits;

final readonly class IssueEvidencePermitHandler implements CommandHandler
{
    public function __construct(private CurrentAuthorizer $administration, private EvidenceRuns $evidence) {}

    public function handle(IssueEvidencePermit $command): string
    {
        $this->administration->authorize(ProcessAdministrationPolicy::class, CommandRequest::class, ProcessAbility::Administer);
        $runner = new ActorIdentity(ActorType::from($command->runnerType), $command->runnerId);

        $limits = new PermitLimits($command->byteCap, $command->secondsCap, $command->minutesValid);

        return $this->evidence->issue($command->line, $command->workingFolder, $runner, $limits)->id;
    }
}
