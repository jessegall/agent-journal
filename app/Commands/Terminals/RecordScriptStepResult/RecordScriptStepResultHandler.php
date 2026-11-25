<?php

declare(strict_types=1);

namespace App\Commands\Terminals\RecordScriptStepResult;

use App\Contracts\Actors\ActorGuidance;
use App\Contracts\Bus\CommandHandler;
use App\Models\Profiles\ProfileRun;
use App\Models\Profiles\ProfileStepResult;
use App\Values\AgentText;
use App\Values\StepOutcome;

/**
 * Records the host's step outcome on the run that waits on it, resumes that run and wakes its actor to go on.
 */
final readonly class RecordScriptStepResultHandler implements CommandHandler
{
    public function __construct(private ActorGuidance $guidance) {}

    public function handle(RecordScriptStepResultCommand $command): void
    {
        $run = ProfileRun::findLockedForStep($command->runId);

        if (! $run->hasRecordedStep($command->stepReference)) {
            $run->resumeAfter($command->stepReference);

            ProfileStepResult::create(
                $run,
                $command->stepReference,
                StepOutcome::reported($command->status, $command->port, $command->evidence),
            );
        }

        $this->guidance->retain($run->actor(), AgentText::of('core.scripts.step_finished'), $command->stepReference);
    }
}
