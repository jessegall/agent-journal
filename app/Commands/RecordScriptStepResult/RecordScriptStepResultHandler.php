<?php

declare(strict_types=1);

namespace App\Commands\RecordScriptStepResult;

use App\Contracts\Actors\ActorGuidance;
use App\Contracts\Bus\CommandHandler;
use App\Models\ProfileRun;
use App\Models\ProfileStepResult;
use App\Values\StepOutcome;

/**
 * Records the host's step outcome on the run that waits on it, resumes that run and wakes its actor to go on.
 */
final readonly class RecordScriptStepResultHandler implements CommandHandler
{
    public const string RECORDED = 'The host finished a step of your profile\'s script; stop again to go on.';

    public function __construct(private ActorGuidance $guidance) {}

    public function handle(RecordScriptStepResultCommand $command): void
    {
        $run = ProfileRun::lockedForStep($command->runId);

        if (! $run->hasRecordedStep($command->stepReference)) {
            $run->resumeAfter($command->stepReference);

            ProfileStepResult::create(
                $run,
                $command->stepReference,
                StepOutcome::reported($command->status, $command->port, $command->evidence),
            );
        }

        $this->guidance->retain($run->actor(), self::RECORDED, $command->stepReference);
    }
}
